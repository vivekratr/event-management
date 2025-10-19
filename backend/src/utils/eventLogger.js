
const logEventUpdate = (event, updatedBy, changes) => {
    const now = new Date();
    
   

    const logEntry = {
        timestamp: now,
        updatedBy,
        changes: Object.entries(changes).map(([field, { oldValue, newValue }]) => ({
            field,
            oldValue,
            newValue
        }))
    };

    if (!event.updateLogs) {
        event.updateLogs = [];
    }
    event.updateLogs.push(logEntry);
};

export default logEventUpdate;
