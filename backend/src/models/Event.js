import mongoose from "mongoose";

const updateLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true },
    changes: [{
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed
    }]
});

const eventSchema = new mongoose.Schema(
    {
        profiles: { type: [String], required: true },
        timezone: { type: String, default: "UTC" },
        startUTC: { type: Date, required: true },
        endUTC: { type: Date, required: true },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
        createdBy: { type: String, required: true },
        updateLogs: { type: [updateLogSchema], default: [] }
    },
    { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
