import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";

interface NewsArticle {
  link: string;
  headline: string;
  date: string;
  image: string;
  articleSelector: string;
  linkSelector: string;
}

class WebSearching {
  public async Search(): Promise<any[]> {
    const newsArticles: NewsArticle[] = [
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
      const headlines: any[] = [];

      for (const article of newsArticles) {
        const response: AxiosResponse = await axios.get(article.link, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
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
          const headline = $(articleHeadlines[i])?.text().trim();
          const date = $(articleDates[i])?.text().trim();
          const image = $(articleImages[i])?.attr("srcset");
          const body = $(articleBodies[i])?.text().trim();
          const link = $(articleLinks[i])?.attr("href");

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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        // Handle error or retry logic here
      } else {
        console.error("Unknown error:", error);
      }
    }

    return [];
  }
}

export default WebSearching;
