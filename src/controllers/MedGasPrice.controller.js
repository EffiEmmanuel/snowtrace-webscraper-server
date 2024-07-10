import MedGasPriceModel from "../models/MedGasPrice.model.js";
import MedGasPriceService from "../services/MedGasPriceService.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new MedGasPriceService instance
const medGasPriceService = new MedGasPriceService(MedGasPriceModel);

// Fetch Med Gas Prices
export const fetchMedGasPrices = async (req, res) => {
  try {
    // Fetch med gas prices
    const response = await medGasPriceService.fetchMedGasPrices();

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      medGasPrices: response?.medGasPrices,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};
