"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const InstaLog = (secretKey) => {
    return {
        secretKey,
        listEvents: (page = 0, search_val) => {
            return prisma.event.findMany({
                orderBy: { occurred_at: 'desc' },
                skip: 10 * page,
                take: 11,
                where: {
                    OR: [
                        { actor_name: { contains: search_val, mode: 'insensitive', } },
                        { actor_id: { contains: search_val, mode: 'insensitive', } },
                        { target_name: { contains: search_val, mode: 'insensitive', } },
                        { target_id: { contains: search_val, mode: 'insensitive', } },
                        { action: {
                                id: { contains: search_val, mode: 'insensitive', },
                                name: { contains: search_val, mode: 'insensitive', },
                            } }
                    ]
                },
                include: {
                    action: true,
                    metadata: true
                }
            });
        },
        createEvent: (event) => {
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
            });
        }
    };
};
exports.default = InstaLog;
