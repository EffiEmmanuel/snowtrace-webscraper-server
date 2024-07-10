// @ts-nocheck
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import config from "./config/index.js";
import routes from "./routes.js";
import initLoaders from "./loaders/index.js";
import http from "http";
import { Server } from "socket.io";
import medGasPriceRouter from "./router/MedGasPrice.router.js";
import { initCronJobs } from "./config/cron.js";

async function startServer() {
  const app = express();

  // Express middlewares
  await initLoaders(app);

  // Create server
  const server = http.createServer(app);

  // Set up socket server for real-time communication with snowtrace and the frontend
  const io = new Server(server, {
    cors: {
      origin: ["https://rnsid-trial-effi.vercel.app", "http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  });

  // Socket server
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
  });

  // Routes
  app.use(routes.API_MED_GAS_PRICE_ROUTE, medGasPriceRouter); // med gas router
  app.listen(config.server.port, "0.0.0.0", () => {
    console.log(`Server listening on port ${config.server.port}`);

    // Initialize cron job
    initCronJobs(server, io);
  });

  // Socket server
  server.listen(config.socket.port, "0.0.0.0", () => {
    console.log(`Socket Server listening on port ${config.socket.port}`);
  });
}

// Starting up the server
startServer();
