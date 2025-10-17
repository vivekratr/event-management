import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(" mongodb connected");
        app.listen(PORT, () => console.log(`server running on port ${PORT}`));
    })
    .catch((err) => console.error("mongo connection error:", err));
