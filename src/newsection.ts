import WebSearching from "../actions/websearch";
// import { callOpenAIComplete } from "../controllers/openai/openaihttp";
import CallSendApi from "./callsendapi";

class NewsSection {
  searches = new WebSearching();
  sendmessage = new CallSendApi();

  // private async uploadImageToFacebook(
  //   imageUrl: string
  // ): Promise<string | undefined> {
  //   try {
  //     const response = await axios.post(
  //       "https://graph.facebook.com/v17.0/me/message_attachments?access_token=EAANJhGNj90MBALwFgzV8IyjWjprJMLHgnIjPbxUuanoopnulosGszZCxXEa4HvI9MuLZBAidy5xPeymReXLLQFDhEqgE3685XFAPymbGGsZCyVrbI9OIwNy10NjDhf61n0Vhk3A9lj509ItzRsTCPZBp3OoosQfjiRM7f5psJphY4WDPgels",
  //       {
  //         message: {
  //           attachment: {
  //             type: "image",
  //             payload: {
  //               is_reusable: true,
  //               url: imageUrl,
  //             },
  //           },
  //         },
  //       }
  //     );
  //     console.log("upload: " + response.data.attachment_id);

  //     return response.data.attachment_id;
  //   } catch (error) {
  //     console.error("Failed to upload image to Facebook:", error);
  //     return undefined;
  //   }
  // }

  public async getNews(id: string, initialMessage: string) {
    const news = await this.searches.Search();
    const uniqueNews = this.filterDuplicates(news); // Filter duplicates based on a unique identifier

    for (const item of uniqueNews) {
      const response = {
        recipient: {
          id: id,
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: item.headline,
                  subtitle: "",
                  image_url: item.from + item.image.split(" ")[0],
                  default_action: {
                    type: "web_url",
                    url: item.from + item.link,
                    webview_height_ratio: "tall",
                  },
                  buttons: [
                    {
                      type: "web_url",
                      url: item.from + item.link,
                      title: "Read More",
                    },
                  ],
                },
              ],
            },
          },
        },
      };

      await this.sendmessage.SendApi(response);
    }
  }

  private filterDuplicates(news: any[]): any[] {
    const uniqueNews: any[] = [];
    const uniqueIdentifiers = new Set();

    for (const item of news) {
      const identifier = item.link || item.headline; // Use link or headline as the unique identifier

      if (!uniqueIdentifiers.has(identifier)) {
        uniqueIdentifiers.add(identifier);
        uniqueNews.push(item);
      }
    }

    return uniqueNews;
  }
}

export default NewsSection;
