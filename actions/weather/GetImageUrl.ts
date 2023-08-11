import supabase from "../../supabase"; // Assuming you've exported the Supabase instance from "../../supabase"
import axios from "axios";
import SendUserAMessage from "./SendUserAMessage";
async function GetImageUrl(id: number) {
  const { data } = supabase.storage
    .from("weatherimages")
    .getPublicUrl("public/" + id + "weather-card.png");

  return data.publicUrl;
}

export default async function sendImageMessageToRecipient(
  id: number,
  recipient: string
) {
  const mediaUrl = await GetImageUrl(id);
  console.log(mediaUrl);
  const pageAccessToken =
    "EAAWZBOFgWDNoBOxT7hYFTYpV76u3ef92PNXOqWChqkTJX6uGCDm00r9VMlFVdduezSZCZA8JpttR96pWRIXkUkbDigM1Vi7LfrbB2fvQNLoIFfMn3JWeOiBOHqLWVbKKoop1ZAdZCFTEe1dkdsHfdZCIL4GLcBSNg03LEWZBNR5IOR7dCXPRVEZCJa5fkNeXykpT";
  const messageData = {
    recipient: {
      id: recipient,
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: mediaUrl,
          is_reusable: true,
        },
      },
    },
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/100101999653991/messages?access_token=${pageAccessToken}`,
      messageData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    const userMessageSender = new SendUserAMessage();
    await userMessageSender.SendMessage(
      "Couldn't get weather for now",
      recipient
    );
    throw new Error(error);
  }
}
