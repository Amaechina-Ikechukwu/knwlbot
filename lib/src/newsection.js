"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websearch_1 = __importDefault(require("../actions/websearch"));
// import { callOpenAIComplete } from "../controllers/openai/openaihttp";
const callsendapi_1 = __importDefault(require("./callsendapi"));
class NewsSection {
    constructor() {
        this.searches = new websearch_1.default();
        this.sendmessage = new callsendapi_1.default();
    }
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
    async getNews(id, initialMessage) {
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
    filterDuplicates(news) {
        const uniqueNews = [];
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
exports.default = NewsSection;
//# sourceMappingURL=newsection.js.map