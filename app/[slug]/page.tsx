import { Routes } from "@/utils/routes";
import { SimpleCubeThreeJs } from "@/components/SimpleCubeThreeJs";
import { CubeGui } from "@/components/СubeGui";

export default function Page({ params }: { params: { slug: string } }) {
  switch (params.slug) {
    case Routes.SimpleCubeThreeJs:
      return <SimpleCubeThreeJs />;
    case Routes.CubeGui:
      return <CubeGui />;
    default:
      return null;
  }
}
