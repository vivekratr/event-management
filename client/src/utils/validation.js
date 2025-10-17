export const valiDate= (form) => {
    const start = new Date(`${form.startDate}T${form.startTime}`);
    const end = new Date(`${form.endDate}T${form.endTime}`);
    const now = new Date();

    if (start <= now) return 'Start time must be in the future';
    if (end <= start) return 'End must be after start';
    if (!form.profiles?.length) return 'Select at least one profile';
    return '';
};
  