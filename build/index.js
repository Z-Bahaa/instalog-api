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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios = require('axios');
const cors_1 = __importDefault(require("cors"));
const events_1 = __importDefault(require("./routes/events"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use('/events', events_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Listening... on port " + PORT);
});
app.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ isWorking: true });
}));
// create event
let data = {
    "event": {
        "actor_id": "user_3VG742j9PUA2",
        "actor_name": "zeyad bahaa",
        "group": "instatus.com",
        "action": {
            "name": "user.searched_activity_log_events"
        },
        "target_id": "user_DOKVD1U3L031",
        "target_name": "sami@instatus.com",
        "location": "105.40.62.95",
        "occurred_at": new Date(),
        "metadata": {
            "redirect": "/setup",
            "description": "User login failed.",
            "x_request_id": "req_W4Y47lljg85H"
        }
    }
};
const options = {
    headers: {
        'Content-Type': 'application/json',
    },
};
const sendPostRequest = () => {
    data = {
        "event": {
            "actor_id": "user_3VG742j9PUA2",
            "actor_name": "zeyad bahaa",
            "group": "instatus.com",
            "action": {
                "name": "user.searched_activity_log_events"
            },
            "target_id": "user_DOKVD1U3L031",
            "target_name": "sami@instatus.com",
            "location": "105.40.62.95",
            "occurred_at": new Date(),
            "metadata": {
                "redirect": "/setup",
                "description": "User login failed.",
                "x_request_id": "req_W4Y47lljg85H"
            }
        }
    };
    axios.post('https://instalog-api.onrender.com/events/', data, options)
        .then((response) => {
        console.log(response.data);
    })
        .catch((error) => {
        console.log(error);
    });
};
setInterval(sendPostRequest, 30000);
exports.default = app;
