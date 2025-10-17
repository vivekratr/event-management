import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
