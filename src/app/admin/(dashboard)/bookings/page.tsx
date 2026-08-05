import { BookingsBoard } from "@/components/admin/BookingsBoard";
import { getAllBookings } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();
  return <BookingsBoard bookings={bookings} />;
}
