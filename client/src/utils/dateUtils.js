
export function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}


export function getCurrentTimeString() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}


export function toISOStringNoMs(date) {
    return new Date(date).toISOString().split('.')[0] + 'Z';
}


export function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
  