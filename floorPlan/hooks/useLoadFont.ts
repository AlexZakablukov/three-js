import { useState, useEffect, useCallback } from "react";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import { loadFont } from "@/floorPlan/helpers";

export const useLoadFont = (fontUrl: string) => {
  const [font, setFont] = useState<Font | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadTextFont = useCallback(async () => {
    setLoading(true);
    try {
      const font = await loadFont(fontUrl);
      setFont(font);
    } catch (err: any) {
      setError("Font can not be loaded");
    } finally {
      setLoading(false);
    }
  }, [fontUrl]);

  useEffect(() => {
    loadTextFont().catch((e) => setError(e));
  }, [loadTextFont]);

  return { font, loading, error };
};
