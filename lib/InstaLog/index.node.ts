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
  getAll: (page: string) => any;
  search: (val: string) => any;
  create: (event: InstaLogEvent) => any;
} => {
  return {
    secretKey,
    getAll: (page: string): any => {
      return prisma.event.findMany({
        skip: 5*JSON.parse(page),
        take: 6,
        include: {
          action: true,
          metadata: true
        }
      })
    },
    search: (val: string): any => {
      return prisma.event.findMany({
        where: {
          OR: [
            {actor_name: {contains: val}},
            {actor_id: {contains: val}},
            {target_name: {contains: val}},
            {target_id: {contains: val}},
            {action: {
              id: {contains: val},
              name: {contains: val},
            }}
          ]
        },
        include: {
          action: true,
          metadata: true
        }
      })
    },
    create: (event: InstaLogEvent): any => {
      return prisma.event.create({
        data: {
          id: event.id,
          object: "event",
          actor_id: event.actor_id,
          actor_name: event.actor_name,
          group: event.group,
          target_id: event.target_id,
          target_name: event.target_name,
          location: event.location,
          occurred_at: event.occurred_at,
          action: {
            create: {
              id: event.action.id,
              object: event.action.object,
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
      })
    }
    // listEvents: (): InstaLogEvent[] => this.events,
  };
}

export default InstaLog;