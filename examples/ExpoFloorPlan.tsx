"use client";
import { useEffect } from "react";
import { FloorPlan } from "@/floorPlan/models/FloorPlan";
import { getPreparedFloorPlanData } from "@/floorPlan/helpers";
import { dataApi } from "@/floorPlan/mock/data";
import { Spinner } from "@/components/Spinner";
import { useLoadFont, useLoadTexture } from "@/floorPlan/hooks";

const fontUrl = "/fonts/helvetiker_regular.typeface.json";

export const ExpoFloorPlan = () => {
  const { backgroundImage, items } = getPreparedFloorPlanData(dataApi);
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
    const floorPlan = new FloorPlan({
      containerId: "floorPlan",
      bgTexture: texture,
      font: font,
      items: items,
    });
    return () => {
      floorPlan.destroy();
    };
  }, [texture, font, items]);

  if (textureLoading || fontLoading) {
    return <Spinner />;
  }

  if (textureError || fontError) {
    return (
      <div className="text-red-500">
        {textureError}
        {fontError}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div id="floorPlan" className="w-full h-[calc(100vh-3rem)] relative" />
    </div>
  );
};
