"use client";
import { useEffect, FC, useRef } from "react";
import { FloorPlanThreeJs } from "@/floorPlan/models/FloorPlanThreeJs";
import { Spinner } from "@/components/Spinner";
import { useLoadTexture } from "@/floorPlan/hooks";
import { getPreparedHall } from "@/floorPlan/helpers/getPreparedHall";
import { hallDataApi } from "@/floorPlan/mock/hall";

interface IHallFloorPlanProps {
  id: string;
}

export const HallFloorPlan: FC<IHallFloorPlanProps> = ({ id }) => {
  const floorPlanRef = useRef<FloorPlanThreeJs | null>(null);
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
    floorPlanRef.current = new FloorPlanThreeJs({
      canvasContainerId: "floorPlan",
      labelContainerId: "labels",
      bgTexture: texture,
      bgColor: "white",
      items: items,
    });
    return () => {
      if (floorPlanRef.current !== null) {
        //@ts-ignore
        floorPlanRef.current.destroy();
      }
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
      <div
        id="floorPlan"
        className="w-full relative floorPlan-height overflow-hidden"
      >
        <div id="labels" className="labels" />
      </div>
    </div>
  );
};
