import { ICoords } from "@/canvas/types/helpers";

const getCoords = (event: PointerEvent): ICoords => {
  const { pageX, pageY } = event;
  const { offsetTop, offsetLeft } = event.target as HTMLElement;

  const x = pageX - offsetLeft;
  const y = pageY - offsetTop;

  return { x, y };
};

export default getCoords;
