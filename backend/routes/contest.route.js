import express from "express";
import { contestList, handlePastContests, handleUpdateLink, handleBookmark, handleRemoveBookmark, handleNotification} from "../controllers/contest.controller.js";

const router = express.Router();

router.get("/list", contestList);
router.get("/past", handlePastContests);
router.post("/updateLink", handleUpdateLink);
router.post("/bookmark", handleBookmark);
router.post("/removeBookmark", handleRemoveBookmark)
router.post("/notify", handleNotification);

export default router;