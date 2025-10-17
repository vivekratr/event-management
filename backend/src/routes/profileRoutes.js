import express from "express";
import Profile from "../models/Profile.js";

const router = express.Router();

// tested
router.post("/", async (req, res) => {
    try {
        const { name, adminProfileId } = req.body;

        const adminProfile = await Profile.findById(adminProfileId);

        if (!adminProfile || adminProfile.role !== "admin") {
            return res.status(403).json({ error: "Only admin can create users" });
        }

        const newUser = await Profile.create({
            name,
            
            role: "user", 
        });

        res.json(newUser);
    } catch (err) {
        res.status(400).json({ error: "Only admin can create users" });
    }
});

// tested
router.get("/", async (_req, res) => {
    const profiles = await Profile.find();
    res.json(profiles);
});

export default router;
