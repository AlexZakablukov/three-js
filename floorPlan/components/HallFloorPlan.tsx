"use client";
import { useEffect, FC, useRef } from "react";
import { FloorPlanThreeJs } from "@/floorPlan/models/FloorPlanThreeJs";
import { Spinner } from "@/components/Spinner";
import { useLoadFont, useLoadTexture } from "@/floorPlan/hooks";
import { getPreparedHall } from "@/floorPlan/helpers/getPreparedHall";
import { hallDataApi } from "@/floorPlan/mock/hall";

const fontUrl = "/fonts/helvetiker_regular.typeface.json";

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

  const { font, loading: fontLoading, error: fontError } = useLoadFont(fontUrl);

  useEffect(() => {
    if (!texture || !font) {
      return;
    }
    floorPlanRef.current = new FloorPlanThreeJs({
      containerId: "floorPlan",
      bgTexture: texture,
      bgColor: "white",
      font: font,
      items: items,
    });
    return () => {
      if (floorPlanRef.current !== null) {
        //@ts-ignore
        floorPlanRef.current.destroy();
      }
    };
  }, [texture, font, items]);

  if (textureLoading || fontLoading) {
    return <Spinner />;
  }

  if (textureError || fontError) {
    return (
      <div className="text-red-500">
        {textureError} | {fontError}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div id="floorPlan" className="w-full relative floorPlan-height" />
    </div>
  );
};
