import { useState, useEffect, useCallback } from "react";
import { loadTexture } from "@/floorPlan/helpers";
import { Texture } from "three";

export const useLoadTexture = (textureUrl: string | null) => {
  const [texture, setTexture] = useState<Texture | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadBgTexture = useCallback(async () => {
    setLoading(true);
    try {
      if (!textureUrl) {
        throw new Error("Texture url is empty");
      }
      const texture = await loadTexture(textureUrl);
      setTexture(texture);
    } catch (err: any) {
      console.log(err);
      setError("Texture can not be loaded");
    } finally {
      setLoading(false);
    }
  }, [textureUrl]);

  useEffect(() => {
    loadBgTexture().catch((e) => setError(e));
  }, [loadBgTexture]);

  return { texture, loading, error };
};
