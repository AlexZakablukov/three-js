import { IColor, IColorStringAndOpacity } from '../types/helpers';

/**
 * Converts an RGBA color object to a color string and opacity value.
 * @param {IColor} rgba - The RGBA color object.
 * @returns {IColorStringAndOpacity} - The color string and opacity value.
 */
export const getColorAndOpacityFromRgba = (rgba?: IColor | null): IColorStringAndOpacity => ({
    color: `rgb(${rgba?.r ?? 0}, ${rgba?.g ?? 0}, ${rgba?.b ?? 0})`,
    opacity: rgba?.a || 1,
});
