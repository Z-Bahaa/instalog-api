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
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const EventsRouter = (0, express_1.Router)();
const instalog = (0, InstaLog_1.default)('0');
EventsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = req.body.event;
    try {
        const prismaEvent = yield instalog.createEvent(Object.assign(Object.assign({}, event), { "occurred_at": new Date().toISOString() }));
        res.status(201).json(prismaEvent);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
EventsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search_query = req.query.search_val;
        const last_cursor = req.query.last_cursor;
        const events = yield instalog.listEvents(search_query, last_cursor);
        res.status(200).json(events);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
EventsRouter.get('/lookups/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        users: [
            {
                "actor_id": "user_3VG742j9PUA2",
                "actor_name": "zeyad bahaa",
                "group": "facebook.com",
            },
            {
                "actor_id": "user_3VG742j9PUA2",
                "actor_name": "ali salah",
                "group": "instatus.com",
            },
            {
                "actor_id": "user_3VG742j9PUA2",
                "actor_name": "sami omar",
                "group": "google.com",
            },
        ],
        actions: [
            {
                "name": "user.searched_activity_log_events"
            },
            {
                "name": "user.login_success"
            },
            {
                "name": "user.logout_success"
            },
            {
                "name": "user.login_failure"
            },
            {
                "name": "user.create_post_success"
            }
        ]
    };
    res.json(data);
}));
EventsRouter.get('/export', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search_val = req.query.search_val;
        const events = yield client_1.default.event.findMany({
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
EventsRouter.get('/live', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Client connected');
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    // res.setHeader('Access-Control-Allow-Origin', '*')
    const intervalId = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            users: [
                {
                    "actor_id": "user_3VG742k9PUA2",
                    "actor_name": "zeyad bahaa",
                    "group": "facebook.com",
                    "target_name": "sami@google.com",
                    "target_id": "user_DOKwD1U3L031",
                    "location": "105.40.62.95",
                },
                {
                    "actor_id": "user_3VG7p2j9PUA2",
                    "actor_name": "ali salah",
                    "group": "instatus.com",
                    "target_name": "zeyad@facebook.com",
                    "target_id": "user_DOKVD1UpL031",
                    "location": "189.90.26.15",
                },
                {
                    "actor_id": "user_3VG740j9PUA2",
                    "actor_name": "sami omar",
                    "group": "google.com",
                    "target_name": "ali@instatus.com",
                    "target_id": "user_DOKVD1U3j031",
                    "location": "151.42.72.12",
                },
            ],
            actions: [
                {
                    "name": "user.searched_activity_log_events",
                    "redirect": "/event_log",
                    "description": "User Searched Activity Log Events.",
                    "x_request_id": "req_W4Y47lljg85H"
                },
                {
                    "name": "user.login_success",
                    "redirect": "/profile",
                    "description": "User Logged In Successfully",
                    "x_request_id": "req_C4Y47lljj85H"
                },
                {
                    "name": "user.logout_success",
                    "redirect": "/landing",
                    "description": "User Logged Out Successfully",
                    "x_request_id": "req_H4Y47lljg85w"
                },
                {
                    "name": "user.login_failure",
                    "redirect": "/setup",
                    "description": "User Login Failure",
                    "x_request_id": "req_K4Y47lljg85H"
                },
                {
                    "name": "user.create_post_success",
                    "redirect": "/post",
                    "description": "User Created New Post Successfully.",
                    "x_request_id": "req_O4Y47lljg85H"
                }
            ]
        };
        const randomUser = data.users[Math.floor(Math.random() * data.users.length)];
        const randomAction = data.actions[Math.floor(Math.random() * data.actions.length)];
        const prismaEvent = yield instalog.createEvent({
            "actor_id": randomUser.actor_id,
            "actor_name": randomUser.actor_name,
            "group": randomUser.group,
            "action": {
                "name": randomAction.name,
            },
            "target_id": randomUser.target_id,
            "target_name": randomUser.target_name,
            "location": randomUser.location,
            "occurred_at": new Date().toISOString(),
            "metadata": {
                "redirect": randomAction.redirect,
                "description": randomAction.description,
                "x_request_id": randomAction.x_request_id
            }
        });
        res.write(`data: ${prismaEvent}\n\n`);
    }), 30000);
    res.on('close', () => {
        console.log('Client closed connection');
        clearInterval(intervalId);
        res.end();
    });
}));
exports.default = EventsRouter;
