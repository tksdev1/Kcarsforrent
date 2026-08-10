import { BookingsBoard } from "@/components/admin/BookingsBoard";
import { getAllBookings } from "@/lib/bookings";
import { checkEmailHealth } from "@/lib/email-health";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();
  // Read on the server so the API key itself never reaches the browser — only
  // the verdict does.
  const emailHealth = checkEmailHealth();

  return <BookingsBoard bookings={bookings} emailHealth={emailHealth} />;
}
