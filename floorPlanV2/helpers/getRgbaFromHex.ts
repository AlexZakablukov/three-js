import { IColor } from '../types/helpers';

const DEFAULT_BLACK_COLOR_HEX_ARRAY = ['00', '00', '00', 'ff'];

/**
 * Converts a hexadecimal color string to an RGBA color object.
 *
 * @param {string} hexColor - The hexadecimal color string to convert.
 * @returns {IColor} The RGBA color object representing the converted color.
 */
export const getRgbaFromHex = (hexColor: string): IColor => {
    const [redHex, greenHex, blueHex, alphaHex] =
        hexColor.match(/[^#]{2}/g) || DEFAULT_BLACK_COLOR_HEX_ARRAY;

    return {
        r: parseInt(redHex, 16),
        g: parseInt(greenHex, 16),
        b: parseInt(blueHex, 16),
        a: alphaHex ? parseInt(alphaHex, 16) / 255 : 1,
    };
};
