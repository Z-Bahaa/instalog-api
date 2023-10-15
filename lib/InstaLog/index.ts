import prisma from '../../prisma/client'

import InstaLogEvent from '../../types/event'

const InstaLog = (secretKey: string): {
  secretKey: string;
  listEvents: (search_val: string, last_cursor: any) => any;
  createEvent: (event: InstaLogEvent) => any;
} => {
  return {
    secretKey,
    listEvents: async (search_val: string, last_cursor: any): Promise<any> => {
      let result = await prisma.event.findMany({
        orderBy: { occurred_at: 'desc' },
        ...(last_cursor && {
          skip: 1, 
          cursor: {
            id: last_cursor as string,
          }
        }),
       
        take: 10,
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
      
      if (result.length == 0) {
        return{
       data: [],
       metaData: {
         last_cursor: null,
         has_next_page: false,
       },
        }
      }

      const lastPostInResults: any = result[result.length - 1];
      const cursor: any = lastPostInResults.id;

      const nextPage = await prisma.event.findMany({
        take:  7,
        skip: 1, 
        cursor: {
          id: cursor,
        },
      });
      const data = {
        data: result, metaData: {
        last_cursor: cursor,
        has_next_page: nextPage.length > 0,
        }
      };

      return data;
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