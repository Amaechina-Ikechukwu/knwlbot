// import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import request from "request";
import { callOpenAIComplete } from "../controllers/openai/openaihttp";
import { storeChats } from "../controllers/database/storechats";
var admin = require("firebase-admin");
import dotenv from "dotenv";
import WebSearching from "../actions/websearch";
import Weather from "../controllers/weather/index";
import NewsSection from "./newsection";
const searches = new WebSearching();
const newsection = new NewsSection();
dotenv.config();
const app = express();
const VERIFY_TOKEN = "knwl";

app.use(express.json());

var serviceAccount = require("../odezssa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://odezssa-default-rtdb.firebaseio.com",
});

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
const weatherPhrases: string[] = [
  "hows today?",
  "Weather",
  "weather?",
  "whats the weather",
  "whats the weather?",
  "weather",
  "hows today",
  "how is today",
  "hows the sky",
  "whats happening",
];
function removeLastWordIgnorePunctuation(inputString: string) {
  // Match the last word followed by optional punctuation
  const regex = /([\w'-]+)[^\w'-]*$/;

  // Use the regex to find the match and remove it
  const result = inputString?.replace(regex, "").trim();

  return result;
}
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

        if (newsPhrases.includes(webhookEvent.message.text?.toLowerCase())) {
          await newsection.getNews(
            webhookEvent.sender.id,
            webhookEvent.message
          );
        } else if (
          weatherPhrases.includes(
            removeLastWordIgnorePunctuation(
              webhookEvent.message.text?.toLowerCase()
            )
          )
        ) {
          console.log(webhookEvent);
          await Weather(webhookEvent);
        } else {
          handleMessage(webhookEvent.sender.id, webhookEvent.message);
        }
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
  }, 3600000); // 30 minutes in milliseconds

  // 2 hours in milliseconds
};

refuseToSleep();

app.listen(3000, () => {});
// exports.bot = onRequest(app);
