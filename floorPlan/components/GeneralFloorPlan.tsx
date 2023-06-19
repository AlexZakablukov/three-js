"use client";
import { useEffect } from "react";
import { FloorPlanThreeJs } from "@/floorPlan/models/FloorPlanThreeJs";
import { getPreparedPlace } from "@/floorPlan/helpers";
import { placeDataApi } from "@/floorPlan/mock/place";
import { Spinner } from "@/components/Spinner";
import { useLoadTexture } from "@/floorPlan/hooks";
import { Routes } from "@/utils/routes";
import { IFloorPlanItemData } from "@/floorPlan/types/prepared";
import { useRouter } from "next/navigation";

export const GeneralFloorPlan = () => {
  const router = useRouter();
  const { backgroundImage, items } = getPreparedPlace(placeDataApi);
  const {
    texture,
    loading: textureLoading,
    error: textureError,
  } = useLoadTexture(backgroundImage);

  const handleHallClick = (data: IFloorPlanItemData) => {
    router.push(`${Routes.ExpoFloorPlan}/${data.id}`);
  };
  useEffect(() => {
    if (!texture) {
      return;
    }
    const floorPlan = new FloorPlanThreeJs({
      containerId: "floorPlan",
      bgTexture: texture,
      bgColor: "white",
      items: items,
      events: {
        item: {
          onItemClick: handleHallClick,
        },
      },
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
