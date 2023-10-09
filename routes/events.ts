import { Router, Request } from 'express'
import { PrismaClient } from '@prisma/client'
import InstaLog from '../lib/InstaLog/index.node'
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const EventsRouter = Router()
const prisma = new PrismaClient()
const instalog = InstaLog('0')


EventsRouter.post('/', async (req: Request & {body: any}, res: any) => {
  const event = req.body.event  

  try {

    const prismaEvent = await instalog.createEvent(event)
    
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

export default EventsRouter;

