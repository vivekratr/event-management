export const convertToTimezone = (dateStr, targetTz) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { timeZone: targetTz });
};

export const formatDateTime = (dateStr, sourceTz, targetTz) => {
    console.log('formatDateTime called with:', { dateStr, sourceTz, targetTz });
    
    if (!dateStr) {
        console.log('No date string provided');
        return 'N/A';
    }
    
    try {
        // Create date object from the ISO string (which is in UTC)
        const date = new Date(dateStr);
        
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateStr);
            return 'Invalid date';
        }
        
        // Use target timezone if provided, otherwise use source timezone
        const timeZone = targetTz || sourceTz || 'UTC';
        
        console.log('Date object created:', {
            input: dateStr,
            parsed: date.toString(),
            iso: date.toISOString(),
            timeZone
        });
        
        // Format options
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone,
            hour12: true,
            timeZoneName: 'short'
        };
        
        // Format the date
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formatted = formatter.format(date);
        
        console.log('Formatted date:', formatted);
        return formatted;
        
    } catch (error) {
        console.error('Error formatting date:', error, {
            dateStr,
            type: typeof dateStr,
            sourceTz,
            targetTz
        });
        return 'Date error';
    }
};