"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callOpenAIComplete = void 0;
const axios_1 = __importDefault(require("axios"));
const supabase_js_1 = require("@supabase/supabase-js");
const getchats_1 = __importDefault(require("../database/getchats"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const API_KEY = "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" || " ";
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const url = "https://uozlshbqcnhtbhrlhiqj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemxzaGJxY25odGJocmxoaXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0NjAwOTIsImV4cCI6MjAwMDAzNjA5Mn0.nT1AcwTyfyjx9AmOBBgouJHt7nNFlZWoCZ5JsbBMSyo" ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemxzaGJxY25odGJocmxoaXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0NjAwOTIsImV4cCI6MjAwMDAzNjA5Mn0.nT1AcwTyfyjx9AmOBBgouJHt7nNFlZWoCZ5JsbBMSyo";
const supabase = (0, supabase_js_1.createClient)(url, supabaseKey);
const getchat = new getchats_1.default(supabase);
async function callOpenAIComplete(prompt, tablename) {
    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        };
        const chats = await getchat.getChats(tablename);
        const messages = [
            ...chats.map((chat) => ({
                role: "assistant",
                content: chat.content.text,
            })),
            { role: "user", content: prompt },
        ];
        const data = {
            model: "gpt-3.5-turbo",
            messages,
        };
        const response = await axios_1.default.post(API_ENDPOINT, data, { headers });
        const text = response.data.choices[0].message.content;
        return text.trim();
    }
    catch (error) {
        return null;
    }
}
exports.callOpenAIComplete = callOpenAIComplete;
//# sourceMappingURL=openaihttp.js.map