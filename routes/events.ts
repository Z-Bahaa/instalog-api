import { Router, Request } from 'express'
import prisma from '../prisma/client'
import InstaLog from '../lib/InstaLog'
import Lookups from '../lookups';
import eventEmitter from '../eventEmitter';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const EventsRouter = Router()
const instalog = new InstaLog('0')

interface EventPayload {
  actor_id: string;
  actor_name: string;
  group: string;
  action: {
    name: string;
  };
  target_id: string;
  target_name: string;
  location: string;
  occurred_at: string;
  metadata: {
    redirect: string;
    description: string;
    x_request_id: string;
  };
}

EventsRouter.post('/', async (req, res) => {
  const payload: EventPayload = req.body

  try {

    const newEvent = instalog.createEvent(payload)


    const savedEvent = await prisma.event.create({
      data: {
        actor_id: newEvent.actor_id,
        actor_name: newEvent.actor_name,
        group: newEvent.group,
        target_id: newEvent.target_id,
        target_name: newEvent.target_name,
        location: newEvent.location,
        occurred_at: newEvent.occurred_at,
        action: {
          create: {
            name: newEvent.action.name,
          }
        },
        metadata: {
          create: {
            redirect: newEvent.metadata.redirect,
            description: newEvent.metadata.description,
            x_request_id: newEvent.metadata.x_request_id,
          }
        },
      },
      include: {
        action: true,
        metadata: true
      }
    })

    res.status(201).json(savedEvent)
  } catch (err) {
    res.status(500).json(err);
  }

})

EventsRouter.get('/', async (req: Request & { query: any }, res: any) => {

  try {
    const { page, search_val } = req.query

    const allEvents = prisma.event.findMany({
      orderBy: { occurred_at: 'desc' },
      skip: 10 * (page || 0),
      take: 10,
      where: {
        OR: [
          { actor_name: { contains: search_val, mode: 'insensitive', } },
          { actor_id: { contains: search_val, mode: 'insensitive', } },
          { target_name: { contains: search_val, mode: 'insensitive', } },
          { target_id: { contains: search_val, mode: 'insensitive', } },
          {
            action: {
              id: { contains: search_val, mode: 'insensitive', },
              name: { contains: search_val, mode: 'insensitive', },
            }
          }
        ]
      },
      include: {
        action: true,
        metadata: true
      }
    });

    res.status(200).json(allEvents)
  } catch (err) {
    res.status(500).json(err);
  }

})


EventsRouter.get('/export', async (req: Request & { query: any }, res: any) => {
  try {
    const { search_val } = req.query
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { actor_name: { contains: search_val, mode: 'insensitive', } },
          { actor_id: { contains: search_val, mode: 'insensitive', } },
          { target_name: { contains: search_val, mode: 'insensitive', } },
          { target_id: { contains: search_val, mode: 'insensitive', } },
          {
            action: {
              id: { contains: search_val, mode: 'insensitive', },
              name: { contains: search_val, mode: 'insensitive', },
            }
          }
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
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')

  eventEmitter.on('new_event_created', (newEvent) => {
    res.write(`data: ${newEvent}\n\n`)
  })

  res.on('close', () => {
    res.end()
  })

})

export default EventsRouter;

