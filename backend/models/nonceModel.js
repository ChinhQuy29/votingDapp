import mongoose from "mongoose";

const noncesSchema= mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        nonce: {
            type: String,
            required: true,
        }
    }
)

export const Nonces= mongoose.model("Nonces", noncesSchema);