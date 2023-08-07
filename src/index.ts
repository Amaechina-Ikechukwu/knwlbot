// import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import request from "request";
import { callOpenAIComplete } from "../controllers/openai/openaihttp";
import { storeChats } from "../controllers/database/storechats";
import dotenv from "dotenv";
import WebSearching from "../actions/websearch";

import NewsSection from "./newsection";
const searches = new WebSearching();
const newsection = new NewsSection();
dotenv.config();
const app = express();
const VERIFY_TOKEN = "knwl";
// const PAGE_ACCESS_TOKEN =
//   "EAANJhGNj90MBALwFgzV8IyjWjprJMLHgnIjPbxUuanoopnulosGszZCxXEa4HvI9MuLZBAidy5xPeymReXLLQFDhEqgE3685XFAPymbGGsZCyVrbI9OIwNy10NjDhf61n0Vhk3A9lj509ItzRsTCPZBp3OoosQfjiRM7f5psJphY4WDPgels";

app.use(express.json());

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

async function handleMessage(senderId: any, message: any) {
  const answer = await callOpenAIComplete(message.text, `chat${senderId}`);
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

function handlePostback(senderId: any, postback: any) {
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
const newsPhrases: string[] = [
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
function callSendAPI(response: any) {
  request(
    {
      uri: "https://graph.facebook.com/v13.0/me/messages",
      qs: {
        access_token:
          "EAANJhGNj90MBALwFgzV8IyjWjprJMLHgnIjPbxUuanoopnulosGszZCxXEa4HvI9MuLZBAidy5xPeymReXLLQFDhEqgE3685XFAPymbGGsZCyVrbI9OIwNy10NjDhf61n0Vhk3A9lj509ItzRsTCPZBp3OoosQfjiRM7f5psJphY4WDPgels",
      },
      method: "POST",
      json: response,
    },
    (err: any, res: any, body: any) => {
      if (!err && res.statusCode === 200) {
      } else {
        console.error("Unable to send message:", err);
      }
    }
  );
}

app.get("/webhook", (req: any, res: any) => {
  if (req.query["hub.verify_token"] === VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", (req: any, res: any) => {
  const body = req.body;
  if (body.object === "page") {
    body.entry.forEach(async (entry: any) => {
      const webhookEvent = entry.messaging[0];

      if (webhookEvent.message) {
        storeChats(webhookEvent);
        console.log(
          newsPhrases.includes(webhookEvent.message.text.toLowerCase())
        );
        if (newsPhrases.includes(webhookEvent.message.text.toLowerCase())) {
          await newsection.getNews(
            webhookEvent.sender.id,
            webhookEvent.message
          );
        } else {
          handleMessage(webhookEvent.sender.id, webhookEvent.message);
        }
        console.log(webhookEvent.message.nlp);
      } else if (webhookEvent.postback) {
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

app.listen(3000, () => {});
// exports.bot = onRequest(app);
