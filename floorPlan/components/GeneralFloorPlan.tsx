"use client";
import { useCallback, useEffect, useRef } from "react";
import { FloorPlanThreeJs } from "@/floorPlan/models/FloorPlanThreeJs";
import { getPreparedPlace } from "@/floorPlan/helpers";
import { placeDataApi } from "@/floorPlan/mock/place";
import { Spinner } from "@/components/Spinner";
import { useLoadFont, useLoadTexture } from "@/floorPlan/hooks";
import { Routes } from "@/utils/routes";
import { IFloorPlanItemData } from "@/floorPlan/types/prepared";
import { useRouter } from "next/navigation";

const fontUrl = "/fonts/helvetiker_regular.typeface.json";

export const GeneralFloorPlan = () => {
  const router = useRouter();
  const floorPlanRef = useRef<FloorPlanThreeJs | null>(null);
  const { backgroundImage, items } = getPreparedPlace(placeDataApi);
  const {
    texture,
    loading: textureLoading,
    error: textureError,
  } = useLoadTexture(backgroundImage);

  const { font, loading: fontLoading, error: fontError } = useLoadFont(fontUrl);

  const handleHallClick = useCallback(
    (data: IFloorPlanItemData) => {
      router.push(`${Routes.ExpoFloorPlan}/${data.id}`);
    },
    [router]
  );

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
  }, [handleHallClick, texture, font, items]);

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
