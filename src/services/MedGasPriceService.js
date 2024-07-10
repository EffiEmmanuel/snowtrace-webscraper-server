import puppeteer from "puppeteer";

export default class MedGasPriceService {
  constructor(RnsidMedGasPriceModel) {
    this.MedGasPriceModel = RnsidMedGasPriceModel;
  }

  // This service CREATES a new med gas price
  async createMedGasPrice(priceInAVAX, priceInUSD) {
    const medGasPrice = await this.MedGasPriceModel.create({
      medGasPriceInAVAX: priceInAVAX,
      medGasPriceInUSD: priceInUSD,
    });

    console.log("CREATED MED GAS PRICE:", medGasPrice);

    const medGasPrices = await this.MedGasPriceModel.find({})
      .sort({
        createdAt: -1,
      })
      .limit(20);

    return {
      status: 201,
      message: "Successfully created med gas price",
      medGasPrices: medGasPrices,
    };
  }

  // This service scrapes data from the snowtrace.io webpage to get the med gas price
  async scrapeMedGasPrices() {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        protocolTimeout: 120000, // Set to 120 seconds, adjust as needed
      });
      const page = await browser.newPage(); // create a new browser page

      // Navigate to the URL once the page is open
      await page.goto("https://www.snowtrace.io", {
        waitUntil: "networkidle0",
        timeout: 300000,
      });

      // Get the med gas price in nAVAX and in USD
      const medGasPriceinAVAX = await page.$eval(
        "div.text-right > a > span.link",
        (element) => element.textContent.trim()
      );
      const medGasPriceinUSD = await page.$eval(
        "div.text-right > span > span",
        (element) => element.textContent.trim()
      );
      await browser.close();

      console.log("MED GAS PRICE IN AVAX:", medGasPriceinAVAX);
      console.log("MED GAS PRICE IN USD:", medGasPriceinUSD);

      return { medGasPriceinAVAX, medGasPriceinUSD };
    } catch (error) {
      console.error("Error scraping med gas prices:", error);
      throw error;
    }
  }

  // This service fetches all med gas prices
  async fetchMedGasPrices() {
    const medGasPrices = await this.MedGasPriceModel.find()
      .sort({
        createdAt: -1,
      })
      .limit(20);

    return {
      status: 200,
      message: "Fetched all med gas prices",
      medGasPrices: medGasPrices,
    };
  }
}
