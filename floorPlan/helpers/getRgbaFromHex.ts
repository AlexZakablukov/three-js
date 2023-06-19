import { IColor } from "@/floorPlan/types/helpers";

/**
 * Convert a hex color to RGBA.
 * @param hexColor - The hex color string, e.g., "#838383" or "#83838380".
 * @returns An object containing the RGBA values.
 */
export const getRgbaFromHex = (hexColor: string): IColor => {
  // Remove the "#" symbol from the hex color string
  const hex = hexColor.replace("#", "");

  // Extract the RGB values from the hex color string
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Extract the alpha value from the hex color string and convert it to a decimal between 0 and 1
  const alphaHex = hex.substring(6, 8);
  const alpha = alphaHex ? parseInt(alphaHex, 16) / 255 : 1;

  // Return the RGBA values as an object
  return { r, g, b, a: alpha };
};
