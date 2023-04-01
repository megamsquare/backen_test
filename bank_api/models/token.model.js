import mongoose from "mongoose";

const Token = mongoose.model(
    'token',
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        refreshToken: { type: String, required: true },
        isValid: { type: Boolean, default: true },
    },
    {
        timestamps: true
    })
);

export default Token;