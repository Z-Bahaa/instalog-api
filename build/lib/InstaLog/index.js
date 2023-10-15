"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const InstaLog = (secretKey) => {
    return {
        secretKey,
        listEvents: (search_val, last_cursor) => __awaiter(void 0, void 0, void 0, function* () {
            let result = yield client_1.default.event.findMany(Object.assign(Object.assign({ orderBy: { occurred_at: 'desc' } }, (last_cursor && {
                skip: 1,
                cursor: {
                    id: last_cursor,
                }
            })), { take: 10, where: {
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
                }, include: {
                    action: true,
                    metadata: true
                } }));
            if (result.length == 0) {
                return {
                    data: [],
                    metaData: {
                        last_cursor: null,
                        has_next_page: false,
                    },
                };
            }
            const lastPostInResults = result[result.length - 1];
            const cursor = lastPostInResults.id;
            const nextPage = yield client_1.default.event.findMany({
                take: 7,
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
        }),
        createEvent: (event) => {
            return client_1.default.event.create({
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
