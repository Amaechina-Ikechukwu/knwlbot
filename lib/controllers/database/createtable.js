"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Client } = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// import { config } from "firebase-functions";
dotenv_1.default.config();
// Create a new PostgreSQL client
const client = new Client({
    host: "db.uozlshbqcnhtbhrlhiqj.supabase.co",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "squillion123",
});
// Connect to the database
// SQL query to create the "chat" table
const createChatTableQuery = `
  CREATE TABLE IF NOT EXISTS chat (
    id SERIAL PRIMARY KEY,
    content JSONB,
    sender BIGINT,
    timestamp BIGINT,
    recipient BIGINT,
    read JSONB
  );
`;
class TableController {
    async createTable(info) {
        try {
            client.connect();
            // Execute the "chat" table creation query
            await client.query(createChatTableQuery);
        }
        catch (error) {
            console.error("Error creating table:", error);
        }
        finally {
            // Close the database connection
            client.end();
        }
    }
}
exports.default = TableController;
//# sourceMappingURL=createtable.js.map