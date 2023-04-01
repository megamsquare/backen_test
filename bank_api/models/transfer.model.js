import mongoose from "mongoose";

const Transfer = mongoose.model(
    'transfer',
    new mongoose.Schema({
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
         },
        amount: { type: String, required: true },
    },
    {
        timestamps: true
    })
);

export default Transfer;