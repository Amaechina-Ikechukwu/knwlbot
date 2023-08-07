"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { onRequest } from "firebase-functions/v2/https";
const express_1 = __importDefault(require("express"));
const request_1 = __importDefault(require("request"));
const openaihttp_1 = require("../controllers/openai/openaihttp");
const storechats_1 = require("../controllers/database/storechats");
const dotenv_1 = __importDefault(require("dotenv"));
const websearch_1 = __importDefault(require("../actions/websearch"));
const newsection_1 = __importDefault(require("./newsection"));
const searches = new websearch_1.default();
const newsection = new newsection_1.default();
dotenv_1.default.config();
const app = (0, express_1.default)();
const VERIFY_TOKEN = "knwl";
// const PAGE_ACCESS_TOKEN =
//   "EAANJhGNj90MBALwFgzV8IyjWjprJMLHgnIjPbxUuanoopnulosGszZCxXEa4HvI9MuLZBAidy5xPeymReXLLQFDhEqgE3685XFAPymbGGsZCyVrbI9OIwNy10NjDhf61n0Vhk3A9lj509ItzRsTCPZBp3OoosQfjiRM7f5psJphY4WDPgels";
app.use(express_1.default.json());
// const options = {
//   uri: "https://graph.facebook.com/v13.0/me/subscribed_apps",
//   qs: {
//     access_token: PAGE_ACCESS_TOKEN,
//     subscribed_fields:
//       "messages,message_reads,message_deliveries,messaging_postbacks,messaging_optins,messaging_account_linking,messaging_referrals,standby,message_reactions,message_attachments",
//   },
//   method: "POST",
//   json: true,
// };
// request(options, (error: any, response: any, body: any) => {
//   if (!error && response.statusCode === 200) {
//     console.log("Subscribed to page events successfully");
//   } else {
//     console.error("Failed to subscribe to page events:", error);
//   }
// });
async function handleMessage(senderId, message) {
    const answer = await (0, openaihttp_1.callOpenAIComplete)(message.text, `chat${senderId}`);
    const response = {
        recipient: {
            id: senderId,
        },
        message: {
            text: `${answer == null ? "OPEN_AI is unavailable now" : answer}`,
        },
    };
    callSendAPI(response);
}
function handlePostback(senderId, postback) {
    const response = {
        recipient: {
            id: senderId,
        },
        message: {
            text: `Received your postback: ${postback.title}`,
        },
    };
    callSendAPI(response);
}
const newsPhrases = [
    "anything today?",
    "anything new?",
    "news?",
    "whats up?",
    "whats happening?",
    "anything today",
    "anything new",
    "news",
    "whats up",
    "whats happening",
];
function callSendAPI(response) {
    (0, request_1.default)({
        uri: "https://graph.facebook.com/v13.0/me/messages",
        qs: {
            access_token: "EAANJhGNj90MBALwFgzV8IyjWjprJMLHgnIjPbxUuanoopnulosGszZCxXEa4HvI9MuLZBAidy5xPeymReXLLQFDhEqgE3685XFAPymbGGsZCyVrbI9OIwNy10NjDhf61n0Vhk3A9lj509ItzRsTCPZBp3OoosQfjiRM7f5psJphY4WDPgels",
        },
        method: "POST",
        json: response,
    }, (err, res, body) => {
        if (!err && res.statusCode === 200) {
        }
        else {
            console.error("Unable to send message:", err);
        }
    });
}
app.get("/webhook", (req, res) => {
    if (req.query["hub.verify_token"] === VERIFY_TOKEN) {
        res.send(req.query["hub.challenge"]);
    }
    else {
        res.sendStatus(403);
    }
});
app.post("/webhook", (req, res) => {
    const body = req.body;
    if (body.object === "page") {
        body.entry.forEach(async (entry) => {
            const webhookEvent = entry.messaging[0];
            if (webhookEvent.message) {
                (0, storechats_1.storeChats)(webhookEvent);
                console.log(newsPhrases.includes(webhookEvent.message.text.toLowerCase()));
                if (newsPhrases.includes(webhookEvent.message.text.toLowerCase())) {
                    await newsection.getNews(webhookEvent.sender.id, webhookEvent.message);
                }
                else {
                    handleMessage(webhookEvent.sender.id, webhookEvent.message);
                }
                console.log(webhookEvent.message.nlp);
            }
            else if (webhookEvent.postback) {
                handlePostback(webhookEvent.sender.id, webhookEvent.postback);
            }
        });
        res.sendStatus(200);
    }
});
app.get("/news", async (request, res) => {
    res.status(200).json({
        body: await searches.Search(),
    });
});
const refuseToSleep = () => {
    const intervalId = setInterval(() => {
        console.log("awaken again");
    }, 1800000); // 30 minutes in milliseconds
    // Stop the interval after 2 hours (7,200 seconds)
    setTimeout(() => {
        clearInterval(intervalId);
        console.log("I shall sleep now.");
    }, 7200000); // 2 hours in milliseconds
};
refuseToSleep();
app.listen(3000, () => { });
// exports.bot = onRequest(app);
//# sourceMappingURL=index.js.map