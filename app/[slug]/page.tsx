import { Routes } from "@/utils/routes";
import { SimpleCubeThreeJs } from "@/examples/SimpleCubeThreeJs";
import { CubeGui } from "@/examples/СubeGui";
import { RayCasterSpheres } from "@/examples/RayCasterSpheres";

export default function Page({ params }: { params: { slug: string } }) {
  switch (params.slug) {
    case Routes.SimpleCubeThreeJs:
      return <SimpleCubeThreeJs />;
    case Routes.CubeGui:
      return <CubeGui />;
    case Routes.RayCasterSpheres:
      return <RayCasterSpheres />;
    default:
      return null;
  }
}
