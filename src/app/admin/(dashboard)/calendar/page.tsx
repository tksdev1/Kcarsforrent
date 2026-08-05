import { BlackoutManager } from "@/components/admin/BlackoutManager";
import { getAllBookings, getBlackouts } from "@/lib/bookings";
import { getAllCars } from "@/lib/fleet";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const [cars, blackouts, bookings] = await Promise.all([
    getAllCars(),
    getBlackouts(),
    getAllBookings(),
  ]);

  return (
    <BlackoutManager cars={cars} blackouts={blackouts} bookings={bookings} />
  );
}
