import express from "express";
import Event from "../models/Event.js";
import Profile from "../models/Profile.js";
import { toUTC } from "../utils/timezone.js";

const router = express.Router();

/*
 POST /api/events
 Create a new event (by any existing profile)
 */
// tested
router.post("/", async (req, res) => {
    try {
        const { profiles, timezone, start, end, createdBy } = req.body;

        const creator = await Profile.findById(createdBy);
        if (!creator) return res.status(400).json({ error: "Invalid creator profile" });

        const startUTC = toUTC(start, timezone);
        const endUTC = toUTC(end, timezone);
        if (endUTC <= startUTC) return res.status(400).json({ error: "End time must be after start time" });

        const event = await Event.create({
            profiles,  
            timezone,
            startUTC,
            endUTC,
            createdBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
 
/**
 * GET /api/events?profile=<profileId>
 * Fetch only events assigned to the given profile
 * tested successfully
 */
router.get("/", async (req, res) => {
    try {
        const { profile } = req.query;
        if (!profile) return res.status(400).json({ error: "Profile ID required" });

        const events = await Event.find({ profiles: profile }).populate("profiles");
        res.json(events);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * PATCH /api/events/:id
 * Update an event only if the requester is assigned to it
 * tested successfully
 */
router.patch("/:id", async (req, res) => {
    try {
        const { requesterId, start, end, timezone, profiles } = req.body;

        const requester = await Profile.findById(requesterId);
        if (!requester) return res.status(400).json({ error: "Invalid requester profile" });

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Check if requester is assigned to this event
        const isAssigned = event.profiles.map(String).includes(requesterId);
        if (!isAssigned) return res.status(403).json({ error: "Access denied: not part of this event" });
        // Track changes
        const changes = {};
        const timezoneToUse = timezone || event.timezone;

        // Handle time updates separately
        let startUTC = event.startUTC;
        let endUTC = event.endUTC;

        // Update start time only
        if (start && !end) {
            startUTC = toUTC(start, timezoneToUse);
            if (startUTC >= event.endUTC) {
                return res.status(400).json({ error: "Start time must be before current end time" });
            }
            changes.startDateTime = { oldValue: event.startUTC, newValue: startUTC };
            event.startUTC = startUTC;
        }

        // Update end time only
        if (end && !start) {
            endUTC = toUTC(end, timezoneToUse);
            if (endUTC <= event.startUTC) {
                return res.status(400).json({ error: "End time must be after current start time" });
            }
            changes.endDateTime = { oldValue: event.endUTC, newValue: endUTC };
            event.endUTC = endUTC;
        }

        // Update both start and end times
        if (start && end) {
            startUTC = toUTC(start, timezoneToUse);
            endUTC = toUTC(end, timezoneToUse);
            if (endUTC <= startUTC) {
                return res.status(400).json({ error: "End time must be after start time" });
            }
            changes.startDateTime = { oldValue: event.startUTC, newValue: startUTC };
            changes.endDateTime = { oldValue: event.endUTC, newValue: endUTC };
            event.startUTC = startUTC;
            event.endUTC = endUTC;
        }

        // Update other fields
        if (timezone && timezone !== event.timezone) {
            changes.timezone = { oldValue: event.timezone, newValue: timezone };
            event.timezone = timezone;
        }

        if (profiles && JSON.stringify(profiles) !== JSON.stringify(event.profiles)) {
            changes.profiles = { oldValue: [...event.profiles], newValue: [...profiles] };
            event.profiles = profiles;
        }

        // Only save and log if there are changes
        if (Object.keys(changes).length > 0) {
            // Log the changes
            event.updateLogs.push({
                timestamp: new Date(),
                timezone: timezoneToUse,
                updatedBy: requesterId,
                changes: Object.entries(changes).map(([field, { oldValue, newValue }]) => ({
                    field,
                    oldValue,
                    newValue
                }))
            });

            // Update the updatedAt timestamp
            event.updatedAt = new Date();

            // Save the updated event
            await event.save();
        }

        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * GET /api/events/:id/logs
 * Get update logs for a specific event
 */
router.get("/:id/logs", async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id, 'updateLogs').lean();

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Format the logs for better readability
        const formattedLogs = event.updateLogs ? event.updateLogs.map(log => ({
            timestamp: log.timestamp,
            timezone: log.timezone,
            updatedBy: log.updatedBy,
            changes: log.changes.map(change => ({
                field: change.field,
                oldValue: change.oldValue,
                newValue: change.newValue
            }))
        })) : [];

        res.json(formattedLogs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


export default router;
