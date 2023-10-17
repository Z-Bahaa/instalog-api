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
/* Generate Frequent Events */
const client_1 = __importDefault(require("./prisma/client"));
const eventEmitter_1 = __importDefault(require("./eventEmitter"));
const lookups_1 = __importDefault(require("./lookups"));
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const randomUser = lookups_1.default.users[Math.floor(Math.random() * lookups_1.default.users.length)];
    const randomAction = lookups_1.default.actions[Math.floor(Math.random() * lookups_1.default.actions.length)];
    const newEvent = yield client_1.default.event.create({
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
    });
    eventEmitter_1.default.emit('new_event_created', newEvent);
}), 30000);
