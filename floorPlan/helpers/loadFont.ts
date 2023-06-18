import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";

const fontLoader = new FontLoader();

export const loadFont = (fontUrl: string): Promise<Font> => {
  return new Promise<Font>((resolve, reject) => {
    fontLoader.load(fontUrl, resolve, undefined, reject);
  });
};
