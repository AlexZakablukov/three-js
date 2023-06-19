"use client";
import { useEffect, FC } from "react";
import { FloorPlanThreeJs } from "@/floorPlan/models/FloorPlanThreeJs";
import { Spinner } from "@/components/Spinner";
import { useLoadTexture } from "@/floorPlan/hooks";
import { getPreparedHall } from "@/floorPlan/helpers/getPreparedHall";
import { hallDataApi } from "@/floorPlan/mock/hall";

interface IHallFloorPlanProps {
  id: string;
}

export const HallFloorPlan: FC<IHallFloorPlanProps> = ({ id }) => {
  const { backgroundImage, items } = getPreparedHall(hallDataApi);
  const {
    texture,
    loading: textureLoading,
    error: textureError,
  } = useLoadTexture(backgroundImage);

  useEffect(() => {
    if (!texture) {
      return;
    }
    const floorPlan = new FloorPlanThreeJs({
      containerId: "floorPlan",
      bgTexture: texture,
      bgColor: "white",
      items: items,
    });
    return () => {
      floorPlan.destroy();
    };
  }, [texture, items]);

  if (textureLoading) {
    return <Spinner />;
  }

  if (textureError) {
    return <div className="text-red-500">{textureError}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div id="floorPlan" className="w-full h-[calc(100vh-3rem)] relative" />
    </div>
  );
};
