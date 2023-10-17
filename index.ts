import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'

import EventsRouter from './routes/events'

import './eventEmitter'
import './generateEvents'

const app = express()

app.use(logger('dev:method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/events', EventsRouter);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Listening... on port " + PORT)
})
app.get('/', async (_: any, res: any) => {
  res.json({ isWorking: true })
})



export default app;
