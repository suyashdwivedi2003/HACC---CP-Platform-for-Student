import mongoose, { Schema } from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, trim: true, index: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: {type: Date, required: true},
    createdAt: {type: Date, default: Date.now(), expires: 600},
});

const OtpModel = mongoose.model('Otp', otpSchema);

export default OtpModel;