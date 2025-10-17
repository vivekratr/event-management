export const valiDate = (form) => {
    // Check if required fields are present
    if (!form.startDate || !form.startTime || !form.endDate || !form.endTime) {
        return 'Please fill in all date and time fields';
    }

    // Create date objects with proper timezone handling
    const createDate = (dateStr, timeStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
    };

    try {
        const start = createDate(form.startDate, form.startTime);
        const end = createDate(form.endDate, form.endTime);
        const now = new Date();

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return 'Invalid date or time format';
        }

        if (start <= now) return 'Start time must be in the future';
        if (end <= start) return 'End time must be after start time';
        if (!form.profiles?.length) return 'Select at least one participant';
        
        return ''; // No errors
    } catch (error) {
        console.error('Error validating dates:', error);
        return 'Error validating dates';
    }
};