import express from "express";
import { fetchData } from "../controllers/ratings.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/fetchData", protectRoute, fetchData);

export default router;