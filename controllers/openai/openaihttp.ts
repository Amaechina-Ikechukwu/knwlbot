import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import ChatController from "../database/getchats";
import dotenv from "dotenv";
dotenv.config();
const API_KEY: string =
  "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" || " ";
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const url: string = "https://uozlshbqcnhtbhrlhiqj.supabase.co";
const supabaseKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemxzaGJxY25odGJocmxoaXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0NjAwOTIsImV4cCI6MjAwMDAzNjA5Mn0.nT1AcwTyfyjx9AmOBBgouJHt7nNFlZWoCZ5JsbBMSyo" ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemxzaGJxY25odGJocmxoaXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0NjAwOTIsImV4cCI6MjAwMDAzNjA5Mn0.nT1AcwTyfyjx9AmOBBgouJHt7nNFlZWoCZ5JsbBMSyo";
const supabase = createClient(url, supabaseKey);
const getchat = new ChatController(supabase);
export async function callOpenAIComplete(
  prompt: string,
  tablename: string
): Promise<string | null> {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };
    const chats = await getchat.getChats(tablename);
    const messages = [
      ...chats.map((chat: any) => ({
        role: "assistant",
        content: chat.content.text,
      })),
      { role: "user", content: prompt },
    ];

    const data = {
      model: "gpt-3.5-turbo",
      messages,
    };
    const response = await axios.post(API_ENDPOINT, data, { headers });
    const text: string = response.data.choices[0].message.content;
    return text.trim();
  } catch (error: any) {
    return null;
  }
}
