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
const client_1 = require("@prisma/client");
const index_node_1 = __importDefault(require("../lib/InstaLog/index.node"));
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const EventsRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const instalog = (0, index_node_1.default)('0');
EventsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = req.body.event;
    try {
        const prismaEvent = yield instalog.createEvent(event);
        res.status(201).json(prismaEvent);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
EventsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page === undefined ? 0 : req.query.page;
        const search_query = req.query.search_val;
        const events = yield instalog.listEvents(page, search_query);
        res.status(200).json(events);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
EventsRouter.get('/export', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search_val = req.query.search_val;
        const events = yield prisma.event.findMany({
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
exports.default = EventsRouter;
