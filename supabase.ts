import { createClient, SupabaseClient } from "@supabase/supabase-js";
import "dotenv/config";
const supabaseUrl: string = "https://uozlshbqcnhtbhrlhiqj.supabase.co";
const supabaseKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemxzaGJxY25odGJocmxoaXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0NjAwOTIsImV4cCI6MjAwMDAzNjA5Mn0.nT1AcwTyfyjx9AmOBBgouJHt7nNFlZWoCZ5JsbBMSyo";
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
export default supabase;
