import { FleetManager } from "@/components/admin/FleetManager";
import { getAllCars } from "@/lib/fleet";

export const dynamic = "force-dynamic";

export default async function AdminFleetPage() {
  const cars = await getAllCars();
  return <FleetManager cars={cars} />;
}
