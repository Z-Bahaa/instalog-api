import { Router, Request } from 'express'
import prisma from '../prisma/client'
import InstaLog from '../lib/InstaLog'
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const EventsRouter = Router()
const instalog = InstaLog('0')


EventsRouter.post('/', async (req: Request & {body: any}, res: any) => {
  const event = req.body.event  

  try {

    const prismaEvent = await instalog.createEvent({...event, "occurred_at": new Date().toISOString()})
    
    res.status(201).json(prismaEvent)
  } catch (err) {
    res.status(500).json(err);
  }

})

EventsRouter.get('/', async (req: Request & {query: any}, res: any) => { 

  try {
    const page = req.query.page === undefined ? 0 : req.query.page
    const search_query = req.query.search_val
    const events = await instalog.listEvents(page, search_query)
    
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json(err);
  }

})

EventsRouter.get('/export', async (req: Request & {query: any}, res: any) => { 

  try {
    const search_val = req.query.search_val
    const events = await prisma.event.findMany({
      where: {
        OR: [
          {actor_name: {contains: search_val, mode: 'insensitive',}},
          {actor_id: {contains: search_val, mode: 'insensitive',}},
          {target_name: {contains: search_val, mode: 'insensitive',}},
          {target_id: {contains: search_val, mode: 'insensitive',}},
          {action: {
            id: {contains: search_val, mode: 'insensitive',},
            name: {contains: search_val, mode: 'insensitive',},
          }}
        ]
      },
      include: {
        action: true,
        metadata: true
      }
    });
    const csvWriter = createCsvWriter({      
      orderBy: { occurred_at: 'desc' },
      path: 'events.csv',
      header: [ 
        { id: 'id', title: 'ID' },
        { id: 'object', title: 'Object' },
        { id: 'actor_id', title: 'Actor ID' },
        { id: 'actor_name', title: 'Actor Name' },
        { id: 'group', title: 'Group' },
        { id: 'target_id', title: 'Target ID' },
        { id: 'target_name', title: 'Target Name' },
        { id: 'location', title: 'Location' },
        { id: 'occurred_at', title: 'Occurred At' },
        { id: 'action.name', title: 'Action' },
        { id: 'metadata.description', title: 'Description' },
        { id: 'metadata.redirect', title: 'Redirect' },
      ],
      
    });
    await csvWriter.writeRecords(events);

    res.status(200).download('events.csv', 'events.csv');
  } catch (err) {
    res.status(500).json(err);
  }

})

EventsRouter.get('/live', async (req: Request, res: any) => {
  console.log('Client connected')
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  // res.setHeader('Access-Control-Allow-Origin', '*')

  const data = {
    "event": {  
      "actor_id": "user_3VG742j9PUA2",
      "actor_name": "zeyad bahaa",
      "group": "instatus.com",
      "action": {
        "name": "user.searched_activity_log_events"
      },
      "target_id": "user_DOKVD1U3L031",
      "target_name": "zeyad@instatus.com",
      "location": "105.40.62.95",
      "occurred_at": new Date().toISOString(),
      "metadata": {
        "redirect": "/setup",
        "description": "User Searched Activity Log Events.",
        "x_request_id": "req_W4Y47lljg85H"
      }
   }
  }
  const prismaEvent = instalog.createEvent(data.event)
  res.write(`data: ${prismaEvent}\n\n`)

  const intervalId = setInterval(() => {
    const data = {
      "event": {  
        "actor_id": "user_3VG742j9PUA2",
        "actor_name": "zeyad bahaa",
        "group": "instatus.com",
        "action": {
          "name": "user.searched_activity_log_events"
        },
        "target_id": "user_DOKVD1U3L031",
        "target_name": "zeyad@instatus.com",
        "location": "105.40.62.95",
        "occurred_at": new Date().toISOString(),
        "metadata": {
          "redirect": "/setup",
          "description": "User Searched Activity Log Events.",
          "x_request_id": "req_W4Y47lljg85H"
        }
     }
    }
    const prismaEvent = instalog.createEvent(data.event)
    res.write(`data: ${prismaEvent}\n\n`)
  }, 30000)

  res.on('close', () => {
    console.log('Client closed connection')
    clearInterval(intervalId)
    res.end()
  })


})

export default EventsRouter;

