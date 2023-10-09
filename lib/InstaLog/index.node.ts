import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


interface InstaLogEvent {
  id: string;
  object: string;
  actor_id: string;
  actor_name: string;
  group: string;
  action: {
    id: string;
    object: string;
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

const InstaLog = (secretKey: string): {
  secretKey: string;
  listEvents: (page: number, search_val: string) => any;
  createEvent: (event: InstaLogEvent) => any;
} => {
  return {
    secretKey,
    listEvents: (page: number = 0, search_val: string): any => {
      return prisma.event.findMany({
        skip: 5*page,
        take: 6,
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
    },
    createEvent: (event: InstaLogEvent): any => {
      return prisma.event.create({
        data: {
          actor_id: event.actor_id,
          actor_name: event.actor_name,
          group: event.group,
          target_id: event.target_id,
          target_name: event.target_name,
          location: event.location,
          occurred_at: event.occurred_at,
          action: {
            create: {
              name: event.action.name,
            }
          },
          metadata: {
            create: {
              redirect: event.metadata.redirect,
              description: event.metadata.description,
              x_request_id: event.metadata.x_request_id,
            }
          },
        },
        include: {
          action: true,
          metadata: true
        }
      })
    }
  };
}

export default InstaLog;