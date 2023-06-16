import { Texture, TextureLoader } from "three";

const textureLoader = new TextureLoader();

export const loadTexture = (textureUrl: string): Promise<Texture> => {
  return new Promise<Texture>((resolve, reject) => {
    textureLoader.load(
      textureUrl,
      // TODO: remove setTimeout: just for a test case
      (texture) => {
        setTimeout(() => {
          resolve(texture);
        }, 1000);
      },
      // resolve,
      undefined,
      reject
    );
  });
};
