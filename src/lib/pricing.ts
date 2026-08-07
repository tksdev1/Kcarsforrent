import { eachDate, isWeekend, rentalDays } from "./dates";
import type { Car, Quote, QuoteLine } from "./types";

export interface QuoteInput {
  car: Car;
  startDate: string;
  endDate: string;
  deliveryRequested: boolean;
}

/**
 * Builds an itemised estimate.
 *
 * This is an *estimate*, not a charge — bookings are requests until the owner
 * confirms them, so nothing here touches a payment processor. Weekend days
 * (Fri/Sat/Sun) use the car's weekend rate when one is set.
 */
export function buildQuote({
  car,
  startDate,
  endDate,
  deliveryRequested,
}: QuoteInput): Quote {
  const days = Math.max(1, rentalDays(startDate, endDate));
  const dates = eachDate(startDate, endDate);

  const weekendRate = car.weekendRate ?? car.dailyRate;
  const flatRate = weekendRate === car.dailyRate;

  const lines: QuoteLine[] = [];

  if (flatRate) {
    // One rate every day, so splitting the breakdown into "weekday" and
    // "weekend" lines would imply a distinction the customer isn't being
    // charged for. Show it as a single line.
    lines.push({
      label: `Rental — ${days} ${plural(days, "day")} × ${money(car.dailyRate)}`,
      amount: days * car.dailyRate,
    });
  } else {
    const weekdayDates = dates.filter((d) => !isWeekend(d));
    const weekendDates = dates.filter((d) => isWeekend(d));

    if (weekdayDates.length > 0) {
      lines.push({
        label: `Weekday rate — ${weekdayDates.length} ${plural(weekdayDates.length, "day")} × ${money(car.dailyRate)}`,
        amount: weekdayDates.length * car.dailyRate,
      });
    }

    if (weekendDates.length > 0) {
      lines.push({
        label: `Weekend rate — ${weekendDates.length} ${plural(weekendDates.length, "day")} × ${money(weekendRate)}`,
        amount: weekendDates.length * weekendRate,
      });
    }
  }

  if (car.cleaningFee > 0) {
    lines.push({ label: "Cleaning & prep", amount: car.cleaningFee });
  }

  if (deliveryRequested && car.deliveryFee > 0) {
    lines.push({ label: "Delivery & pickup", amount: car.deliveryFee });
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0);

  return { days, lines, total: round2(total) };
}

function plural(count: number, word: string) {
  return count === 1 ? word : `${word}s`;
}

function money(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
