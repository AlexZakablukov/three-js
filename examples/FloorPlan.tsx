"use client";
import { useEffect, useState } from "react";
import { FloorPlanThreeJs, FloorPlanEvents } from "@/lib/FloorPlanThreeJs";
import { IFloorPlanItemData } from "@/lib/FloorPlanItem";
import { FLOOR_PLAN_ITEMS, getRandomFloorItems } from "@/utils/floorplanItems";
import { loadTexture } from "@/floorPlan/helpers/loadTexture";

export const FloorPlan = () => {
  const [pickedItem, setPickedItem] = useState<IFloorPlanItemData | null>(null);

  const onItemClick = (data: IFloorPlanItemData) => {
    setPickedItem(data);
  };

  useEffect(() => {
    const threeScene = new FloorPlanThreeJs({
      containerId: "floorPlan",
      enableStats: true,
      enableControls: true,
      // items: FLOOR_PLAN_ITEMS,
      items: getRandomFloorItems(1000),
      events: {
        [FloorPlanEvents.OnItemClick]: onItemClick,
      },
    });
    return () => {
      threeScene.destroy();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex align-center w-full h-10 mb-2 bg-blue-600 p-2 rounded-md">
        <h1>{pickedItem ? pickedItem.title : "Click on any rect"}</h1>
      </div>
      <div id="floorPlan" className="w-full flex-grow relative" />
    </div>
  );
};
