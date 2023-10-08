import { Router, Request } from 'express'
import { PrismaClient } from '@prisma/client'
import Event from '../types/event'
import InstaLog from '../lib/InstaLog/index.node'

const Home = Router()
const prisma = new PrismaClient()
const instalog = InstaLog('0')


Home.get('/', async (req: Request, res) => {
  res.json({ isWorking: true })
})

Home.post('/new', async (req: Request & {body: any}, res) => {
  const event = req.body.event  

  try {

    const prismaEvent = await instalog.create(event)
    
    res.status(201).json(prismaEvent)
  } catch (err) {
    res.status(500).json(err);
  }

})

Home.get('/all', async (req: Request & {body: any}, res) => { 

  try {

    const events = await instalog.getAll(req.body.page)
    
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json(err);
  }

})

Home.get('/search', async (req: Request & {body: any}, res) => { 
  const val = req.body.search_val

  try {

    const events = await instalog.search(val)
    
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json(err);
  }

})

export default Home;

