import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);


export function toUTC(localTime, tz) {
    return dayjs.tz(localTime, tz).utc().toDate();
}
export function toLocal(utcTime, tz) {
    return dayjs.utc(utcTime).tz(tz).format("YYYY-MM-DD HH:mm");
}
