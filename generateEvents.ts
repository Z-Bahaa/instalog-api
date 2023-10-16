/* Generate Frequent Events */

import prisma from './prisma/client'

import eventEmitter from "./eventEmitter";
import Lookups from "./lookups";

setInterval(async () => {


  const randomUser = Lookups.users[Math.floor(Math.random() * Lookups.users.length)];
  const randomAction = Lookups.actions[Math.floor(Math.random() * Lookups.actions.length)];

  const newEvent = await prisma.event.create({
    data: {
      actor_id: randomUser.actor_id,
      actor_name: randomUser.actor_name,
      group: randomUser.group,
      target_id: randomUser.target_id,
      target_name: randomUser.target_name,
      location: randomUser.location,
      occurred_at: new Date().toISOString(),
      action: {
        create: {
          name: randomAction.name,
        }
      },
      metadata: {
        create: {
          redirect: randomAction.redirect,
          description: randomAction.description,
          x_request_id: randomAction.x_request_id,
        }
      },
    },
    include: {
      action: true,
      metadata: true
    }
  })

  eventEmitter.emit('new_event_created', newEvent)

}, 30000)