import supabase from "../../supabase";

export async function CheckIfUserIsSubscribedToWeather(
  userid: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("weather")
      .select("userid")
      .eq("userid", userid);

    if (error) {
      throw new Error(`Error querying database: ${error.message}`);
    }

    if (data && data.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    // You can log the error here or perform other error handling
    throw new Error(`Failed to check weather subscription: ${error.message}`);
  }
}
