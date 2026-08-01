import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import cron from "node-cron";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import contactRoutes from "./routes/contact.route.js";
import axios from "axios";
import blogRoutes from "./routes/blog.route.js";
import messageRoutes from "./routes/message.route.js";
import contestRoutes from "./routes/contest.route.js";
import RatingRoutes from "./routes/ratings.route.js";

import Message from "./models/message.model.js";
import User from "./models/user.model.js";
import Contest from "./models/contest.model.js";
import admin from "./lib/firebase-admin.js";

import { fetchDataAndUpdateDB } from "./lib/utils.js";

import { app, server } from "./lib/socket.js";

dotenv.config();
// const app = express();

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" })); //profile picture upload from frontend may have size more than 1 mb.
app.use(cookieParser());
app.use(
  cors({
    origin: "https://haccnitrr.netlify.app",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contest", contestRoutes);
app.use("/api/ratings", RatingRoutes);
app.use(express.static("public"));


app.get('/healthCheck', (req, res) => {
  res.sendStatus(200);
});

cron.schedule("*/10 * * * *", async () => {
  //run in every 10 minutes
  try {
    console.log("Inside cron job try block");
    await fetchDataAndUpdateDB();
    console.log("Update completed");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});


cron.schedule("0 */12 * * *", async () => {          //run everyday at 00:00  "0 */12 * * *"
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 4);

    await Message.deleteMany({ createdAt: { $lte: cutoffDate } });
    console.log("Old messages deleted");
  } catch (error) {
    console.error("Error in second cron job: ", error);
  }
});


server.listen(PORT, () => {
  console.log("server is running on PORT: ", PORT);
  connectDB();
});
