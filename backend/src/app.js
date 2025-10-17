import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("server is running"));

app.use("/api/profiles", profileRoutes);
app.use("/api/events", eventRoutes); 

export default app;
