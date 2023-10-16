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
const express_1 = require("express");
const client_1 = __importDefault(require("../prisma/client"));
const InstaLog_1 = __importDefault(require("../lib/InstaLog"));
const eventEmitter_1 = __importDefault(require("../eventEmitter"));
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const EventsRouter = (0, express_1.Router)();
const instalog = new InstaLog_1.default('0');
EventsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = (_a = req.body) === null || _a === void 0 ? void 0 : _a.event;
    payload.occurred_at = new Date().toISOString();
    try {
        const newEvent = instalog.createEvent(payload);
        const savedEvent = yield client_1.default.event.create({
            data: {
                actor_id: newEvent.actor_id,
                actor_name: newEvent.actor_name,
                group: newEvent.group,
                target_id: newEvent.target_id,
                target_name: newEvent.target_name,
                location: newEvent.location,
                occurred_at: newEvent.occurred_at,
                action: {
                    create: {
                        name: newEvent.action.name,
                    }
                },
                metadata: {
                    create: {
                        redirect: newEvent.metadata.redirect,
                        description: newEvent.metadata.description,
                        x_request_id: newEvent.metadata.x_request_id,
                    }
                },
            },
            include: {
                action: true,
                metadata: true
            }
        });
        res.status(201).json(savedEvent);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
EventsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search_val, last_cursor } = req.query;
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
            res.status(200).json({
                data: [],
                metaData: {
                    last_cursor: null,
                    has_next_page: false,
                },
            });
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
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
EventsRouter.get('/export', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search_val } = req.query;
        const events = yield client_1.default.event.findMany({
            where: {
                OR: [
                    { actor_name: { contains: search_val, mode: 'insensitive', } },
                    { actor_id: { contains: search_val, mode: 'insensitive', } },
                    { target_name: { contains: search_val, mode: 'insensitive', } },
                    { target_id: { contains: search_val, mode: 'insensitive', } },
                    {
                        action: {
                            id: { contains: search_val, mode: 'insensitive', },
                            name: { contains: search_val, mode: 'insensitive', },
                        }
                    }
                ]
            },
            include: {
                action: true,
                metadata: true
            }
        });
        const csvWriter = createCsvWriter({
            orderBy: { occurred_at: 'desc' },
            path: 'events.csv',
            header: [
                { id: 'id', title: 'ID' },
                { id: 'object', title: 'Object' },
                { id: 'actor_id', title: 'Actor ID' },
                { id: 'actor_name', title: 'Actor Name' },
                { id: 'group', title: 'Group' },
                { id: 'target_id', title: 'Target ID' },
                { id: 'target_name', title: 'Target Name' },
                { id: 'location', title: 'Location' },
                { id: 'occurred_at', title: 'Occurred At' },
                { id: 'action.name', title: 'Action' },
                { id: 'metadata.description', title: 'Description' },
                { id: 'metadata.redirect', title: 'Redirect' },
            ],
        });
        yield csvWriter.writeRecords(events);
        res.status(200).download('events.csv', 'events.csv');
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
EventsRouter.get('/live', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    eventEmitter_1.default.on('new_event_created', (newEvent) => {
        res.write(`data: ${JSON.stringify(newEvent)}\n\n`);
    });
    res.on('close', () => {
        res.end();
    });
}));
exports.default = EventsRouter;
