import express from "express";
import routes from "../routes.js";
import { fetchMedGasPrices } from "../controllers/MedGasPrice.controller.js";

const medGasPriceRouter = express.Router();

// Routes for Med Gas Price
// FETCH MED GAS PRICES
medGasPriceRouter.get("/", fetchMedGasPrices);

export default medGasPriceRouter;
