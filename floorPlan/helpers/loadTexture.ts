import { Texture, TextureLoader } from "three";

const textureLoader = new TextureLoader();

export const loadTexture = (textureUrl: string): Promise<Texture> => {
  return new Promise<Texture>((resolve, reject) => {
    textureLoader.load(textureUrl, resolve, undefined, reject);
  });
};
