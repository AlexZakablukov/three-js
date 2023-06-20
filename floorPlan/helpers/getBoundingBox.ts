import { BufferGeometry } from "three";

export const getBoundingBox = (geometry: BufferGeometry) => {
  geometry.computeBoundingBox();

  const boundingBox = geometry.boundingBox;

  const maxX = boundingBox?.max.x ?? 0;
  const minX = boundingBox?.min.x ?? 0;
  const maxY = boundingBox?.max.y ?? 0;
  const minY = boundingBox?.min.y ?? 0;

  const centerX = (maxX + minX) / 2;
  const centerY = (maxY + minY) / 2;
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    maxX,
    minX,
    maxY,
    minY,
    centerX,
    centerY,
    width,
    height,
  };
};
