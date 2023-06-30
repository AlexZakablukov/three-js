import * as THREE from 'three';
import { IBounds } from '../types/helpers';

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = 'anonymous';

/**
 * Utility class for working with Three.js objects.
 */
export class ThreeJsUtils {
    /**
     * Cleans up the resources used by a Three.js material,
     * including disposing the material and its associated textures.
     *
     * @param {THREE.Material} material - The material to clean up.
     */
    public static cleanMaterial(material: THREE.Material) {
        material.dispose();

        // dispose textures
        if ('map' in material) {
            const texture = material.map;
            if (texture && texture instanceof THREE.Texture) {
                texture.dispose();
            }
        }
    }

    /**
     * Cleans up the resources used by a Three.js object,
     * including disposing its geometry and material(s).
     *
     * @param {THREE.Object3D} object - The object to clean up.
     */
    public static cleanObject(object: THREE.Object3D) {
        if (!(object instanceof THREE.Mesh)) {
            return;
        }
        object.geometry.dispose();

        if (object.material instanceof THREE.Material) {
            ThreeJsUtils.cleanMaterial(object.material);
        } else {
            // an array of materials
            for (const material of object.material) ThreeJsUtils.cleanMaterial(material);
        }
    }

    /**
     * Loads a texture from the specified URL
     *
     * @param {string} textureUrl - The URL of the texture to load.
     * @returns {Promise<THREE.Texture>} A promise that resolves to the loaded texture.
     */
    public static loadTexture(textureUrl: string): Promise<THREE.Texture> {
        return new Promise<THREE.Texture>((resolve, reject) => {
            textureLoader.load(textureUrl, resolve, undefined, reject);
        });
    }

    /**
     * Computes the bounding box of a given buffer geometry and returns its bounds.
     * @param {THREE.BufferGeometry} geometry - The buffer geometry to compute the bounding box from.
     * @returns {IBounds} - The bounds of the computed bounding box.
     */
    public static getBoundingBox(geometry: THREE.BufferGeometry): IBounds {
        geometry.computeBoundingBox();

        const { boundingBox } = geometry;

        const maxX = boundingBox?.max.x ?? 0;
        const minX = boundingBox?.min.x ?? 0;
        const maxY = boundingBox?.max.y ?? 0;
        const minY = boundingBox?.min.y ?? 0;

        const centerX = (maxX + minX) / 2;
        const centerY = (maxY + minY) / 2;
        const width = maxX - minX;
        const height = maxY - minY;
        const area = width * height;

        return {
            maxX,
            minX,
            maxY,
            minY,
            centerX,
            centerY,
            width,
            height,
            area,
        };
    }
}
