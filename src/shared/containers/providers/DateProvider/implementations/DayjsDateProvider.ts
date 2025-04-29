import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
    dateNow(): Date {
        return dayjs().toDate();
    }
    convertToUTC(date: Date): string {
        return dayjs(date).utc().local().format();
    }
    compareInHours(start_date: Date, end_date: Date): number {
        return dayjs(this.convertToUTC(end_date)).diff(
            this.convertToUTC(start_date),
            "hours"
        );
    }

    compareInDays(start_date: Date, end_date: Date): number {
        return dayjs(this.convertToUTC(end_date)).diff(
            this.convertToUTC(start_date),
            "days"
        );
    }

    addDays(days: number): Date {
        // const date = this.dateNow();
        // return dayjs(this.convertToUTC(date)).add(days, "day").toDate();
        return dayjs().add(days, "day").toDate();
    }

    addHours(hours: number): Date {
        return dayjs().add(hours, "hour").toDate();
    }

    addMinutes(minutes: number): Date {
        return dayjs().add(minutes, "minute").toDate();
    }

    compareIfBefore(start_date: Date, end_date: Date): boolean {
        return dayjs(start_date).isBefore(end_date);
    }
}

export { DayjsDateProvider };
