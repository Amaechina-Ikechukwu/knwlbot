import { CheckIfUserIsSubscribedToWeather } from "../../actions/weather/CheckIfUserIsSubscribedToWeather";
import GetWeatherData from "../../actions/weather/GetWeatherData";
import InsertUserData from "../../actions/weather/InsertUserData";
import SendUserAMessage from "../../actions/weather/SendUserAMessage";

interface Data {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message: {
    mid: string;
    text: string;
  };
}

const welcomeMessage =
  "This is your first weather request.\nTo use this, send 'weather plus location'\nExample: weather lagos";

function removeWordsAndPunctuationExceptLast(inputString: string) {
  // Match all words and punctuation except the last word
  const regex = /^.*?(\b\w+\b)[^\w]*$/;

  // Extract the last word using regex and keep it
  const matchResult = inputString.match(regex);
  const lastWord = matchResult ? matchResult[1] : "";

  return lastWord;
}
function capitalizeFirstLetter(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export default async function Weather(data: Data): Promise<string | undefined> {
  try {
    const isUserSubscribed = await CheckIfUserIsSubscribedToWeather(
      data.sender.id
    );
    console.log({ isUserSubscribed });
    if (!isUserSubscribed) {
      const userMessageSender = new SendUserAMessage();
      await userMessageSender.SendMessage(welcomeMessage, data.sender.id);
      await InsertUserData(data.sender.id);
    } else {
      const location = removeWordsAndPunctuationExceptLast(data.message.text);
      const message =
        "Getting weather details for " + capitalizeFirstLetter(location);
      const userMessageSender = new SendUserAMessage();
      await userMessageSender.SendMessage(message, data.sender.id);
      await GetWeatherData(location, data.sender.id);
      return "done";
    }
  } catch (error: any) {
    throw new Error(error.message || "An error occurred.");
  }
}
