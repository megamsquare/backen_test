import mongoose from "mongoose";

const Accounts = mongoose.model(
    'accounts',
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        preAmount: { type: Number, required: true },
        curraMount: { type: Number, required: true }
    },
    {
        timestamps: true
    })
);

export default Accounts;