import { HallFloorPlan } from "@/floorPlan/components/HallFloorPlan";

export default function Page({ params }: { params: { id: string } }) {
  return <HallFloorPlan id={params.id} />;
}
