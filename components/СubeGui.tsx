"use client";
import { useEffect } from "react";
import { ThreeScene } from "@/lib/ThreeScene";

import * as THREE from "three";

export const CubeGui = () => {
  useEffect(() => {
    const threeScene = new ThreeScene("cubeGui");

    threeScene.init();
    threeScene.animate();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });
    const cube = new THREE.Mesh(geometry, material);

    threeScene.scene.add(cube);

    threeScene.camera.position.z = 3;

    function animate() {
      window.requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
    animate();
  }, []);

  return <div id="cubeGui" className="w-full h-full relative" />;
};
