import * as THREE from 'three';
import { ThreeJsUtils } from './ThreeJsUtils';

/**
 * CSS styles for the label wrapper and text.
 */
const LABEL_WRAPPER_STYLES = `
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    overflow: hidden;
`;

const LABEL_TEXT_STYLES = `
    text-align: center;
    white-space: nowrap;
    font-size: small;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export class FloorPlanLabel {
    public elem: HTMLDivElement;

    public textNode: HTMLDivElement;

    public position: THREE.Vector3;

    public area: number;

    /**
     * Creates a new FloorPlanLabel instance.
     * @param mesh The THREE.Mesh object associated with the label.
     * @param text The text content of the label.
     */
    constructor(mesh: THREE.Mesh, text: string) {
        this.createWrapper(mesh);
        this.createText(text);
    }

    /**
     * Creates the wrapper element for the label.
     * @param mesh The associated THREE.Mesh object.
     */
    private createWrapper(mesh: THREE.Mesh) {
        const { width, height, centerX, centerY, area } = ThreeJsUtils.getBoundingBox(
            mesh.geometry,
        );
        const wrapper = document.createElement('div');
        wrapper.style.cssText = LABEL_WRAPPER_STYLES;
        wrapper.style.width = `${width}px`;
        wrapper.style.height = `${height}px`;
        this.position = new THREE.Vector3(centerX, centerY, 1);
        this.area = area;
        this.elem = wrapper;
    }

    /**
     * Creates the text element for the label.
     * @param text The text content of the label.
     */
    private createText(text: string) {
        const textNode = document.createElement('div');
        textNode.textContent = text;
        textNode.style.cssText = LABEL_TEXT_STYLES;
        this.textNode = textNode;
        this.elem.appendChild(textNode);
    }

    /**
     * Hides the label by setting its display style to 'none'.
     */
    public hide() {
        this.elem.style.display = 'none';
    }

    /**
     * Shows the label by setting its display style to 'flex'.
     */
    public show() {
        this.elem.style.display = 'flex';
    }

    /**
     * Updates the position and scale of the label based on the camera zoom.
     * @param x The x-coordinate of the label's position in pixels.
     * @param y The y-coordinate of the label's position in pixels.
     * @param zoom The camera zoom level.
     */
    public updatePosition(x: number, y: number, zoom: number) {
        this.elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px) scale(${zoom}, ${zoom})`;
        this.textNode.style.transform = `scale(${1 / zoom}, ${1 / zoom})`;
    }
}
