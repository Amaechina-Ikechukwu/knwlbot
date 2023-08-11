import { createCanvas, loadImage } from "canvas";
import supabase from "../../supabase"; // Assuming you've exported the Supabase instance from "../../supabase"
import path from "path";
import axios from "axios";
async function createWeatherCard(weatherData: any) {
  const canvas = createCanvas(800, 500); // Increased resolution
  const ctx = canvas.getContext("2d");

  const loadLocalImage = async (imageName: any) => {
    // Replace with the correct path to your images
    const imagePath = path.join(__dirname, "../../images", imageName);
    return await loadImage(imagePath);
  };

  const iconSize = 24; // Increased icon size
  const iconSpacing = 30;
  const textSpacing = 30;

  const dataEntries = [
    {
      icon: "thermometer.png",
      label: `Temperature: ${weatherData.values.temperature}°C`,
    },
    {
      icon: "humidity.png",
      label: `Humidity: ${weatherData.values.humidity}%`,
    },
    {
      icon: "wind.png",
      label: `Wind Speed: ${weatherData.values.windSpeed} km/h`,
    },
    {
      icon: "cloud.png",
      label: `Visibility: ${weatherData.values.visibility} km`,
    },
  ];

  let yOffset = 28;

  const backgroundColor = "#ffffff"; // White background color

  // Draw background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const entry of dataEntries) {
    const icon = await loadLocalImage(entry.icon);
    ctx.globalAlpha = 0.8; // Adjust the opacity for the faded background effect
    ctx.drawImage(icon, 10, yOffset, iconSize, iconSize);
    ctx.globalAlpha = 1; // Reset opacity

    // Increase font size and make it bolder
    ctx.font = "bold 24px Arial"; // Adjust font size
    ctx.fillStyle = "#000000"; // Black text color
    ctx.fillText(entry.label, 10 + iconSize + iconSpacing, yOffset + iconSize);

    yOffset += iconSize + textSpacing;
  }

  const rainProbability = weatherData.values.precipitationProbability;

  // Increase font size for rain probability
  ctx.font = "bold 24px Arial"; // Adjust font size
  ctx.fillText(
    `Rain Probability: ${rainProbability}%`,
    canvas.width - 300,
    canvas.height - 10
  );

  return canvas;
}

async function sendImageAttachmentToPage(fileObject: any) {
  const url = `https://graph.facebook.com/v17.0/100101999653991/message_attachments`;

  const formData = new FormData();
  formData.append(
    "access_token",
    "EAAWZBOFgWDNoBOxT7hYFTYpV76u3ef92PNXOqWChqkTJX6uGCDm00r9VMlFVdduezSZCZA8JpttR96pWRIXkUkbDigM1Vi7LfrbB2fvQNLoIFfMn3JWeOiBOHqLWVbKKoop1ZAdZCFTEe1dkdsHfdZCIL4GLcBSNg03LEWZBNR5IOR7dCXPRVEZCJa5fkNeXykpT"
  );
  formData.append(
    "message",
    JSON.stringify({
      attachment: {
        type: "image",
      },
    })
  );
  formData.append("filedata", fileObject, "image.png");

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Image attachment sent successfully:", response.data);
  } catch (error: any) {
    console.error("Error sending image attachment:", error);
    throw new Error(error);
  }
}

export default async function uploadWeatherCardToSupabase(
  weatherData: string,
  id: number
) {
  const canvas = await createWeatherCard(weatherData);
  const buffer = canvas.toBuffer();
  const fileObject = new Blob([buffer], { type: "image/jpeg" }); // Convert buffer to Blob

  // await sendImageAttachmentToPage(fileObject);

  const { data, error } = await supabase.storage
    .from("weatherimages")
    .upload("public/" + id + "weather-card.png", fileObject);

  if (error) {
    console.error("Error uploading image:", error);
  } else {
    console.log("Image uploaded successfully:", data);
  }
}
