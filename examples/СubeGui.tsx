"use client";
import { useEffect } from "react";
import { ThreeScene } from "@/lib/ThreeScene";
import { GUI } from "dat.gui";

import * as THREE from "three";

export const CubeGui = () => {
  useEffect(() => {
    const threeScene = new ThreeScene("cubeGui");

    threeScene.init();
    threeScene.animate();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
    });
    const cube = new THREE.Mesh(geometry, material);
    threeScene.scene.add(cube);
    threeScene.camera.position.z = 3;

    /* GUI */
    const gui = new GUI();

    const geometryFolder = gui.addFolder("Mesh Geometry");
    geometryFolder.open();
    const rotationFolder = geometryFolder.addFolder("Rotation");
    rotationFolder.add(cube.rotation, "x", 0, Math.PI).name("Rotate X Axis");
    rotationFolder.add(cube.rotation, "y", 0, Math.PI).name("Rotate Y Axis");
    rotationFolder.add(cube.rotation, "z", 0, Math.PI).name("Rotate Z Axis");

    const scaleFolder = geometryFolder.addFolder("Scale");
    scaleFolder.add(cube.scale, "x", 0, 2).name("Scale X Axis");
    scaleFolder.add(cube.scale, "y", 0, 2).name("Scale Y Axis");
    scaleFolder.add(cube.scale, "z", 0, 2).name("Scale Z Axis");
    scaleFolder.open();

    const materialFolder = gui.addFolder("Mesh Material");
    const materialParams = {
      boxMeshColor: cube.material.color.getHex(),
    };
    materialFolder.add(cube.material, "wireframe");
    materialFolder
      .addColor(materialParams, "boxMeshColor")
      .onChange((value) => cube.material.color.set(value));

    return () => {
      gui.destroy();
    };
  }, []);

  return <div id="cubeGui" className="w-full h-full relative" />;
};
