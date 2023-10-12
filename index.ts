import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
const axios = require('axios');
import cors from 'cors'

import EventsRouter from './routes/events'

const app = express()

app.use(logger('dev'));
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


// create event


let data = {
  "event": {  
    "actor_id": "user_3VG742j9PUA2",
    "actor_name": "zeyad bahaa",
    "group": "instatus.com",
    "action": {
      "name": "user.searched_activity_log_events"
    },
    "target_id": "user_DOKVD1U3L031",
    "target_name": "sami@instatus.com",
    "location": "105.40.62.95",
    "occurred_at": new Date(),
    "metadata": {
      "redirect": "/setup",
      "description": "User login failed.",
      "x_request_id": "req_W4Y47lljg85H"
    }
 }
}

const options = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const sendPostRequest = () => {

   data = {
    "event": {  
      "actor_id": "user_3VG742j9PUA2",
      "actor_name": "zeyad bahaa",
      "group": "instatus.com",
      "action": {
        "name": "user.searched_activity_log_events"
      },
      "target_id": "user_DOKVD1U3L031",
      "target_name": "sami@instatus.com",
      "location": "105.40.62.95",
      "occurred_at": new Date(),
      "metadata": {
        "redirect": "/setup",
        "description": "User login failed.",
        "x_request_id": "req_W4Y47lljg85H"
      }
   }
  }

  axios.post('https://instalog-api.onrender.com/events/', data, options)
    .then((response:any) => {
      console.log(response.data);
    })
    .catch((error: any) => {
      console.log(error);
    });
};

setInterval(
  sendPostRequest
, 30000);

export default app;
