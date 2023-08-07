// // openai.ts
// import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
// import dotenv from "dotenv";
// dotenv.config();
// const configuration = new Configuration({
//   apiKey: "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" || "",
// });
// const openai = new OpenAIApi(configuration);
// export async function toOpenAi(prompt: any): Promise<any | null> {
//   const request: CreateChatCompletionRequest = {
//     messages: prompt || "hello",
//     model: "gpt-3.5-turbo",
//   };
//   return openai
//     .createChatCompletion(request)
//     .then((response: any) => {
//       const answer = response.data.choices[0].message?.content.trim();
//       console.log("Response:", answer);
//       return answer;
//     })
//     .catch((error: any) => {
//       console.error("Error:", error.response.statusText);
//       return null;
//     });
// }
