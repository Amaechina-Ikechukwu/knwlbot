import supabase from "../../supabase";
export default async function InsertUserData(userid: string) {
  try {
    const { data, error } = await supabase
      .from("weather")
      .insert([{ userid: userid }])
      .select();
    if (error) {
      throw new Error(`Couldnt insert user data ${error.message}`);
    }
  } catch (error: any) {
    throw new Error(error + "InsertUserData");
  }
}
