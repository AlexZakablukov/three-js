import { IHtmlElementSize } from '../types/helpers';

/**
 * Retrieves the size and position information of an HTML element.
 *
 * @param {HTMLElement} htmlElement - The HTML element for which to retrieve the size and position information.
 * @returns {IHtmlElementSize} An object containing the width, height, ratio, offsetLeft, and offsetTop of the HTML element.
 */
export const getHtmlElementSize = (htmlElement: HTMLElement): IHtmlElementSize => ({
    width: htmlElement.clientWidth,
    height: htmlElement.clientHeight,
    ratio: htmlElement.clientWidth / htmlElement.clientHeight,
    offsetLeft: htmlElement.offsetLeft,
    offsetTop: htmlElement.offsetTop,
});
