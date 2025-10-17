/**
 * Logs changes made to an event
 * @param {Object} event - The event document
 * @param {String} updatedBy - ID of the user making the changes
 * @param {Object} changes - Object containing the changes made
 */
const logEventUpdate = (event, updatedBy, changes) => {
    const now = new Date();
    
   

    // Create log entry
    const logEntry = {
        timestamp: now,
        updatedBy,
        changes: Object.entries(changes).map(([field, { oldValue, newValue }]) => ({
            field,
            oldValue,
            newValue
        }))
    };

    // Add to event's updateLogs array if it exists, otherwise create it
    if (!event.updateLogs) {
        event.updateLogs = [];
    }
    event.updateLogs.push(logEntry);
};

export default logEventUpdate;
