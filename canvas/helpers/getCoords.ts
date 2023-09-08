import { ICoords } from "@/canvas/types/helpers";

/**
 * @description
 * Calculates and returns the coordinates (x, y) of a pointer event relative to a target element's top-left corner.
 *
 * @param {PointerEvent} event - The pointer event for which to calculate coordinates.
 * @returns {ICoords} - An object containing the x and y coordinates relative to the target element.
 */
const getCoords = (event: PointerEvent): ICoords => {
  // Extract the page coordinates of the pointer event.
  const { pageX, pageY } = event;

  // Determine the target element's offset relative to the document's top-left corner.
  const { offsetTop, offsetLeft } = event.target as HTMLElement;

  // Calculate the x and y coordinates relative to the target element's top-left corner.
  const x = pageX - offsetLeft;
  const y = pageY - offsetTop;

  // Return an object containing the calculated coordinates.
  return { x, y };
};

export default getCoords;
