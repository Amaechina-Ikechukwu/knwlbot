const { Client } = require("pg");
import dotenv from "dotenv";
// import { config } from "firebase-functions";
dotenv.config();
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
  public async createTable(info: {
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
  }): Promise<void> {
    try {
      client.connect();
      // Execute the "chat" table creation query
      await client.query(createChatTableQuery);
    } catch (error) {
      console.error("Error creating table:", error);
    } finally {
      // Close the database connection
      client.end();
    }
  }
}

export default TableController;
