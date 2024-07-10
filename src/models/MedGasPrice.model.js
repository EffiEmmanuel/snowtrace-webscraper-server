import mongoose from "mongoose";

// SCHEMA: This schema is for the med gas price
const medGasPriceSchema = new mongoose.Schema(
  {
    medGasPriceInAVAX: {
      type: String,
      required: true,
    },
    medGasPriceInUSD: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MedGasPriceModel = mongoose.model("MedGasPrice", medGasPriceSchema);

export default MedGasPriceModel;
