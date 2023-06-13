"use client";
import { useEffect } from "react";
import { ThreeScene } from "@/lib/ThreeScene";

import * as THREE from "three";

export const SimpleCubeThreeJs = () => {
  useEffect(() => {
    const threeScene = new ThreeScene("simpleCube");

    threeScene.init();
    threeScene.animate();

    const loader = new THREE.TextureLoader();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const texture = loader.load("/textures/earth.png");
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      opacity: 0,
      transparent: false,
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

  return <div id="simpleCube" className="w-full h-full relative" />;
};
