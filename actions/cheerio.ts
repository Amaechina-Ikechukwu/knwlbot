import * as cheerio from "cheerio";
class WebScraping {
  public async Scrape(html: string, article: any): Promise<string[]> {
    const $ = cheerio.load(html);

    let headlines: any = [];

    // const headline = $(article.headline).text().trim();
    // const date = $(article.date).text().trim();
    // const image = $(article.image).attr("src");
    // const body = $(article.articleSelector).text().trim();

    headlines.push({
      headline: $(article.headline).text().trim(),
      date: $(article.date).text().trim(),
      image: $(article.image).attr("src"),
      body: $(article.articleSelector).text().trim(),
    });
    console.log({
      headline: $(article.headline).text().trim(),
      date: $(article.date).text().trim(),
      image: $(article.image).attr("src"),
      body: $(article.articleSelector).text().trim(),
    });
    return headlines;
  }
}
export default WebScraping;
