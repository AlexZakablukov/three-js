"use client";
import { useEffect } from "react";
import { ThreeScene } from "@/lib/ThreeScene";

import * as THREE from "three";

const INITIAL_SPHERE_COLOR = 0xffffff;
const SPHERE_COORDS = [
  // front cubes
  [-2, 2, 2],
  [0, 2, 2],
  [2, 2, 2],
  [-2, 0, 2],
  [0, 0, 2],
  [2, 0, 2],
  [-2, -2, 2],
  [0, -2, 2],
  [2, -2, 2],
  // middle cubes
  [-2, 2, 0],
  [0, 2, 0],
  [2, 2, 0],
  [-2, 0, 0],
  [0, 0, 0],
  [2, 0, 0],
  [-2, -2, 0],
  [0, -2, 0],
  [2, -2, 0],
  // back cubes
  [-2, 2, -2],
  [0, 2, -2],
  [2, 2, -2],
  [-2, 0, -2],
  [0, 0, -2],
  [2, 0, -2],
  [-2, -2, -2],
  [0, -2, -2],
  [2, -2, -2],
];

const generateSphereMesh = (x: number, y: number, z: number) => {
  const geometry = new THREE.SphereGeometry(0.5);
  const material = new THREE.MeshBasicMaterial({ color: INITIAL_SPHERE_COLOR });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x, y, z);
  return sphere;
};

export const RayCasterSpheres = () => {
  useEffect(() => {
    const threeScene = new ThreeScene("rayCasterSpheres");

    threeScene.init();
    threeScene.animate();

    SPHERE_COORDS.forEach(([x, y, z]) => {
      const sphereMesh = generateSphereMesh(x, y, z);
      threeScene.scene.add(sphereMesh);
    });

    threeScene.camera.position.z = 8;

    threeScene.initRayCaster();

    function animate() {
      requestAnimationFrame(animate);
      threeScene.rayCaster.setFromCamera(threeScene.mouse, threeScene.camera);

      const intersections = threeScene.rayCaster.intersectObjects(
        threeScene.scene.children
      );

      if (intersections.length > 0) {
        // @ts-ignore
        const currentColor = intersections[0].object.material.color;
        const isInitialColor = currentColor.getHex() === INITIAL_SPHERE_COLOR;
        if (isInitialColor) {
          currentColor.setHex(Math.random() * 0xffffff);
        }
      }
    }

    animate();
  }, []);

  return <div id="rayCasterSpheres" className="w-full h-full relative" />;
};
