import { Routes } from "@/utils/routes";
import { SimpleCubeThreeJs } from "@/examples/SimpleCubeThreeJs";
import { CubeGui } from "@/examples/СubeGui";
import { RayCasterSpheres } from "@/examples/RayCasterSpheres";
import { FloorPlan } from "@/examples/FloorPlan";

export default function Page({ params }: { params: { slug: string } }) {
  switch (params.slug) {
    case Routes.SimpleCubeThreeJs:
      return <SimpleCubeThreeJs />;
    case Routes.CubeGui:
      return <CubeGui />;
    case Routes.RayCasterSpheres:
      return <RayCasterSpheres />;
    case Routes.FloorPlan:
      return <FloorPlan />;
    default:
      return null;
  }
}
