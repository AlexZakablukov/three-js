"use client";
import { useCallback, useEffect, useRef } from "react";
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
  const floorPlanRef = useRef<FloorPlanThreeJs | null>(null);
  const { backgroundImage, items } = getPreparedPlace(placeDataApi);
  const {
    texture,
    loading: textureLoading,
    error: textureError,
  } = useLoadTexture(backgroundImage);

  const handleHallClick = useCallback(
    (data: IFloorPlanItemData) => {
      router.push(`${Routes.ExpoFloorPlan}/${data.id}`);
    },
    [router]
  );

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
      events: {
        item: {
          onItemClick: handleHallClick,
        },
      },
    });
    return () => {
      if (floorPlanRef.current !== null) {
        //@ts-ignore
        floorPlanRef.current.destroy();
      }
    };
  }, [handleHallClick, texture, items]);

  if (textureLoading) {
    return <Spinner />;
  }

  if (textureError) {
    return <div className="text-red-500">{textureError}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div id="floorPlan" className="w-full relative floorPlan-height">
        <div id="labels" className="labels" />
      </div>
    </div>
  );
};
