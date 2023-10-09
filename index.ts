import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'

import EventsRouter from './routes/events'

const app = express()

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/events', EventsRouter);


app.listen(process.env.PORT, () => {
  console.log("Listening... on port " + process.env.PORT)
})
app.get('/', async (_: any, res: any) => {
  res.json({ isWorking: true })
})

export default app;
