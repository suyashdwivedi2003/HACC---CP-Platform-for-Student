import express from "express";
import { checkAuth, login, logout, signup, updateCodingIds, updateImage, removeImage, oauthUser, oauthLoginUser, generateOTP, loginWithOTP, changePassword, refreshRating, updateProfile, getTotalUsers } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/check", protectRoute, checkAuth);
router.post("/oauthlogin", oauthLoginUser);
router.post("/oauthuser", oauthUser);
router.post("/gen-OTP", generateOTP);
router.post("/login-OTP", loginWithOTP);
// router.post("/signUp-OTP", signUpWithOTP);
router.post("/change-password", changePassword);
router.post("/refreshRatings", refreshRating );
router.put("/updateCodingIds", updateCodingIds);
router.put("/updateProfile", updateProfile);
router.put("/updateImage", protectRoute, 
    upload.fields([
            {
                name: "image",
                maxCount: 1,
            }
    ]),
    updateImage);
router.put("/removeImage", removeImage);
router.get("/getTotalUsers", getTotalUsers);


export default router;