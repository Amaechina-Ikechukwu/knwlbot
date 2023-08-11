import axios from "axios";

class SendUserAMessage {
  public async SendMessage(message: any, userid: string): Promise<void> {
    try {
      const response = {
        recipient: {
          id: userid,
        },
        messaging_type: "RESPONSE",
        message: {
          text: message,
        },
      };

      const accessToken =
        "EAAWZBOFgWDNoBOxT7hYFTYpV76u3ef92PNXOqWChqkTJX6uGCDm00r9VMlFVdduezSZCZA8JpttR96pWRIXkUkbDigM1Vi7LfrbB2fvQNLoIFfMn3JWeOiBOHqLWVbKKoop1ZAdZCFTEe1dkdsHfdZCIL4GLcBSNg03LEWZBNR5IOR7dCXPRVEZCJa5fkNeXykpT"; // Replace with your actual access token

      const url = `https://graph.facebook.com/v17.0/me/messages?access_token=${accessToken}`;

      const axiosConfig = {
        method: "POST",
        url: url,
        data: response,
      };

      const axiosResponse = await axios(axiosConfig);

      if (axiosResponse.status === 200) {
        // Message sent successfully
        console.log("Message sent successfully:", axiosResponse.data);
      } else {
        console.error("Unable to send message. Response:", axiosResponse.data);
      }
    } catch (error: any) {
      console.error("Error sending message:", error.data);
    }
  }
}

export default SendUserAMessage;
