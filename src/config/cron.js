import cron from "node-cron";
import { Server } from "socket.io";
import MedGasPriceService from "../services/MedGasPriceService.js";
import MedGasPriceModel from "../models/MedGasPrice.model.js";

const medGasPriceService = new MedGasPriceService(MedGasPriceModel);

let io; // Socket.io instance

const initCronJobs = (server, io) => {
  console.log("CRON JOB started");
  // Schedule the cron job to run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    try {
      // Fetch updated med gas prices from snowtrace.io using web scraping with puppeteer
      const updatedPrices = await medGasPriceService.scrapeMedGasPrices();

      console.log("UPDATED PRICES:", updatedPrices);

      // Save the just fetched data in the database
      await medGasPriceService.createMedGasPrice(
        updatedPrices?.medGasPriceinAVAX,
        updatedPrices?.medGasPriceinUSD
      );

      console.log("CREATED MED GAS PRICE SUCCESSFULLY");

      // Get all saved med gas prices from the database
      const updatedMedGasPrices = await medGasPriceService.fetchMedGasPrices();

      // Emit updated prices to all connected clients (frontends)
      io.emit("medGasPricesUpdate", updatedMedGasPrices);
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};

export { initCronJobs };
