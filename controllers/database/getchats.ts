import { SupabaseClient, PostgrestResponse } from "@supabase/supabase-js";
class ChatController {
  private supabase: SupabaseClient;
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }
  //ij
  public async getChats(tablename: string): Promise<any> {
    const { data, error }: PostgrestResponse<any> = await this.supabase
      .from(tablename)
      .select("content");
    if (error) {
      return;
    }
    return data;
  }
}
export default ChatController;
