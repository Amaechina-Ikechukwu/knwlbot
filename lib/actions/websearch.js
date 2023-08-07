"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class WebSearching {
    async Search() {
        var _a, _b, _c, _d, _e;
        const newsArticles = [
            // {
            //   link: "https://www.channelstv.com",
            //   headline: ".posts_sumrys .post-title-a",
            //   date: "",
            //   image: ".posts_sumrys .post-thumbnail img",
            //   articleSelector: ".posts_sumrys .post-content",
            //   linkSelector: ".posts_sumrys .post-title-a",
            // },
            // {
            //   link: "https://www.bbc.com/news/world/africa",
            //   headline: "h3.gs-c-promo-heading__title",
            //   date: "time.qa-status-date-output",
            //   image: ".gs-o-responsive-image img",
            //   articleSelector: "p.gs-c-promo-summary",
            //   linkSelector: "a.gs-c-promo-heading",
            // },
            {
                link: "https://www.saharareporters.com",
                headline: "h2.title.is-3 a",
                date: ".card-content-bottom div",
                image: "img[property='schema:image']",
                articleSelector: "div.fusion-post-content",
                linkSelector: "h2.title.is-3 a",
            },
            // Add more news sites as needed
        ];
        try {
            const headlines = [];
            for (const article of newsArticles) {
                const response = await axios_1.default.get(article.link, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
                    },
                });
                const data = response.data;
                const $ = cheerio.load(data);
                const articleHeadlines = $(article.headline);
                const articleDates = $(article.date);
                const articleImages = $(article.image);
                const articleBodies = $(article.articleSelector);
                const articleLinks = $(article.linkSelector);
                for (let i = 0; i < articleHeadlines.length; i++) {
                    const headline = (_a = $(articleHeadlines[i])) === null || _a === void 0 ? void 0 : _a.text().trim();
                    const date = (_b = $(articleDates[i])) === null || _b === void 0 ? void 0 : _b.text().trim();
                    const image = (_c = $(articleImages[i])) === null || _c === void 0 ? void 0 : _c.attr("srcset");
                    const body = (_d = $(articleBodies[i])) === null || _d === void 0 ? void 0 : _d.text().trim();
                    const link = (_e = $(articleLinks[i])) === null || _e === void 0 ? void 0 : _e.attr("href");
                    headlines.push({
                        headline,
                        date,
                        image,
                        body,
                        from: article.link,
                        link,
                    });
                }
            }
            return headlines;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios error:", error.message);
                // Handle error or retry logic here
            }
            else {
                console.error("Unknown error:", error);
            }
        }
        return [];
    }
}
exports.default = WebSearching;
//# sourceMappingURL=websearch.js.map