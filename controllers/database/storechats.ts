// import { createClient } from "@supabase/supabase-js";
import TableController from "./createtable";
import ListOfTablesController from "./listoftables";
import supabase from "../../supabase";
import "dotenv/config";
// Create a single Supabase client for interacting with your database
// const url: string = "https://uozlshbqcnhtbhrlhiqj.supabase.co";
// const supabaseKey: string =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemxzaGJxY25odGJocmxoaXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0NjAwOTIsImV4cCI6MjAwMDAzNjA5Mn0.nT1AcwTyfyjx9AmOBBgouJHt7nNFlZWoCZ5JsbBMSyo" ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemxzaGJxY25odGJocmxoaXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0NjAwOTIsImV4cCI6MjAwMDAzNjA5Mn0.nT1AcwTyfyjx9AmOBBgouJHt7nNFlZWoCZ5JsbBMSyo";

export async function storeChats(info: {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message: object;
  delivery: object;
}): Promise<void> {
  try {
    // const supabase = await supabase;
    const listoftables = new ListOfTablesController(supabase);
    const createTable = new TableController();
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
    } else {
      console.log("Inserted chat data:");
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
