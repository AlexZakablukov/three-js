"use client";
import { useEffect } from "react";
import { FloorPlan } from "@/floorPlan/models/FloorPlan";
import { getPreparedFloorPlanData } from "@/floorPlan/helpers";
import { dataApi } from "@/floorPlan/mock/data";

export const ExpoFloorPlan = () => {
  const { backgroundImage, items } = getPreparedFloorPlanData(dataApi);

  console.log("ExpoFloorPlan", {
    backgroundImage,
    items,
  });

  useEffect(() => {
    const floorPlan = new FloorPlan({
      containerId: "floorPlan",
      backgroundImage: backgroundImage,
      items: items,
    });
    return () => {
      floorPlan.destroy();
    };
  }, [backgroundImage, items]);

  return (
    <div className="w-full h-full flex flex-col">
      <div id="floorPlan" className="w-full h-[calc(100vh-3rem)] relative" />
    </div>
  );
};
