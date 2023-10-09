import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
// import serverless from 'serverless-http';

import EventsRouter from './routes/events'

const app = express()

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/netlify/functions/api', Home);
app.use('/events', EventsRouter);

process.on('uncaughtException', function (err) {
  console.log(err);
}); 

app.listen(process.env.PORT, () => {
  console.log("Listening... on port " + process.env.PORT)
})
app.get('/', async (_ , res) => {
  res.json({ isWorking: true })
})
