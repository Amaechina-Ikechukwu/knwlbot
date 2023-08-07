"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeChats = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const createtable_1 = __importDefault(require("./createtable"));
const listoftables_1 = __importDefault(require("./listoftables"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { config } from "firebase-functions";
dotenv_1.default.config();
// Create a single Supabase client for interacting with your database
const url = "https://uozlshbqcnhtbhrlhiqj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemxzaGJxY25odGJocmxoaXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0NjAwOTIsImV4cCI6MjAwMDAzNjA5Mn0.nT1AcwTyfyjx9AmOBBgouJHt7nNFlZWoCZ5JsbBMSyo" ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemxzaGJxY25odGJocmxoaXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0NjAwOTIsImV4cCI6MjAwMDAzNjA5Mn0.nT1AcwTyfyjx9AmOBBgouJHt7nNFlZWoCZ5JsbBMSyo";
const supabase = (0, supabase_js_1.createClient)(url, supabaseKey);
const listoftables = new listoftables_1.default(supabase);
const createTable = new createtable_1.default();
async function storeChats(info) {
    const table = await listoftables.getTables(`chat${info.sender.id}`);
    if (table === false) {
        await createTable.createTable(info);
    }
    const { error: insertRowError } = await supabase
        .from(`chat${info.sender.id}`)
        .insert([
        {
            sender: info.sender.id,
            recipient: info.recipient.id,
            timestamp: info.timestamp,
            content: info.message || info.delivery,
        },
    ]);
    if (insertRowError) {
        console.error("Error inserting chat data:", insertRowError);
    }
    else {
        console.log("Inserted chat data:");
    }
}
exports.storeChats = storeChats;
//# sourceMappingURL=storechats.js.map