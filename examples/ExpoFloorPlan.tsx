"use client";
import { useCallback, useEffect, useState } from "react";
import { FloorPlan } from "@/floorPlan/models/FloorPlan";
import { getPreparedFloorPlanData } from "@/floorPlan/helpers";
import { dataApi } from "@/floorPlan/mock/data";
import { loadTexture } from "@/floorPlan/helpers/loadTexture";
import { Texture } from "three";
import { texture } from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import { Spinner } from "@/components/Spinner";

export const ExpoFloorPlan = () => {
  const [bgTexture, setBgTexture] = useState<Texture | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { backgroundImage, items } = getPreparedFloorPlanData(dataApi);

  const loadBackgroundTexture = useCallback(async () => {
    setLoading(true);
    try {
      const texture = await loadTexture(backgroundImage);
      setBgTexture(texture);
    } catch (err: any) {
      setError("Texture can not be loaded");
    } finally {
      setLoading(false);
    }
  }, [backgroundImage]);

  useEffect(() => {
    loadBackgroundTexture().catch((e) => console.log(e));
  }, [loadBackgroundTexture]);

  useEffect(() => {
    if (!bgTexture) {
      return;
    }
    const floorPlan = new FloorPlan({
      containerId: "floorPlan",
      bgTexture: bgTexture,
      items: items,
    });
    return () => {
      floorPlan.destroy();
    };
  }, [bgTexture, items]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div id="floorPlan" className="w-full h-[calc(100vh-3rem)] relative" />
    </div>
  );
};
