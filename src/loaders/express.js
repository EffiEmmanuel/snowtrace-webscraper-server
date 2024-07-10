import express from "express";
import cors from "cors";

export default async function expressLoader(app) {
  app.use(
    cors({
      origin: ["https://rnsid-trial-effi.vercel.app", "http://localhost:3000"],
    })
  );
  app.enable("trust proxy");
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: false }));
  return app;
}
