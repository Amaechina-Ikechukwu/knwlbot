import axios from "axios";
import uploadWeatherCardToSupabase from "./CreateWeatherCard";
// Update the path accordingly
import sendMediaMessageToFacebook from "./GetImageUrl";
const TOMORROW_IO_API_KEY = "dbtFaCH0nmyfkrXVE4Pyn08WTlVmQDKW";

export default async function GetWeatherData(
  location: string,
  recipient: string
) {
  try {
    const response = await axios.get(
      "https://api.tomorrow.io/v4/weather/realtime",
      {
        params: {
          location: location,
          apikey: TOMORROW_IO_API_KEY,
        },
        headers: {
          accept: "application/json",
        },
      }
    );

    const weatherData = response.data;
    const id = Math.random();
    await uploadWeatherCardToSupabase(weatherData.data, id);
    await sendMediaMessageToFacebook(id, recipient);
  } catch (error: any) {
    console.error("Error fetching weather data:", error);
    throw new Error(error);
  }
}
