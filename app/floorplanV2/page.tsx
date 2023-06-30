import { FloorPlanView } from "@/floorPlanV2/components/FloorPlanView";
import { getPreparedHall } from "@/floorPlan/helpers/getPreparedHall";
import { hallDataApi } from "@/floorPlan/mock/hall";

export default function Page() {
  const { backgroundImage, items } = getPreparedHall(hallDataApi);

  // @ts-ignore
  return <FloorPlanView items={items} backgroundImage={backgroundImage} />;
}
