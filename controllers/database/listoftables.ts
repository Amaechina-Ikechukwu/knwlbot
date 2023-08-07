import { SupabaseClient, PostgrestResponse } from "@supabase/supabase-js";
class ListOfTablesController {
  private supabase: SupabaseClient;
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }
  public async getTables(tablename: string): Promise<any> {
    try {
      const { error }: PostgrestResponse<any> = await this.supabase
        .from("chats")
        .select("id")
        .eq("tablename", tablename)
        .limit(1);
      if (error) {
        console.error("Error retrieving chat table:", error);
        return false; // Return an empty array in case of an error
      } else {
        return true; // Return the data array or an empty array if it's null
      }
    } catch (error) {
      console.error("Error getting tables:", error);
      return false; // Return an empty array in case of an error
    }
  }
}

export default ListOfTablesController;
