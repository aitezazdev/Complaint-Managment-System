import { connectDB } from "./config/db.js";
import { configDotenv } from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

configDotenv();

connectDB();
app.get("/", (req, res) => {
  res.send("API is running...");
})

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/complaint", complaintRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});