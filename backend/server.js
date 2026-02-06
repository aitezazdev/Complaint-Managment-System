import { connectDB } from "./config/db.js";
import { configDotenv } from "dotenv";
import express from "express";

const app = express();

configDotenv();

connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
})

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});