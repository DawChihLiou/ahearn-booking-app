import { format, utcToZonedTime } from "date-fns-tz";
import { de } from 'date-fns/locale' 
const formatInTimeZone = (date, fmt, tz) =>
    format(utcToZonedTime(date, tz),
        fmt,
        { timeZone: tz,  locale: de  });

export {formatInTimeZone}