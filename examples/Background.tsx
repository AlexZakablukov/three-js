"use client";
import { useEffect } from "react";
import bgImage from "public/images/Hall 1A.jpg";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";

import * as THREE from "three";
import { PerspectiveCamera } from "three";

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin("anonymous");

const loadTexture = (textureUrl: string): Promise<THREE.Texture> => {
  return new Promise<THREE.Texture>((resolve, reject) => {
    textureLoader.load(textureUrl, resolve, undefined, reject);
  });
};

export const Background = () => {
  useEffect(() => {
    const wrapper = document.getElementById("bg");
    if (!wrapper) {
      return;
    }
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;

    /* INIT SCENE */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("red");

    /* INIT CAMERA */
    // const camera = new PerspectiveCamera(1);
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0,
      10
    );

    /* INIT RENDERER */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    /* ADD CANVAS TO WRAPPER */
    wrapper.appendChild(renderer.domElement);

    /* INIT CONTROLS */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.enableRotate = false;

    /* LOAD TEXTURE AND SET UP BACKGROUND IMAGE */
    loadTexture(bgImage.src).then((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;

      const width = texture.source.data.naturalWidth;
      const height = texture.source.data.naturalHeight;

      const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });

      const background = new THREE.Mesh(geometry, material);

      background.position.set(0, 0, -1);

      scene.add(background);

      render();
    });

    /* RENDER FUNC */
    const render = () => {
      console.log({
        zoom: camera.zoom,
        z: camera.position.z,
        distance: controls.getDistance(),
      });
      renderer.render(scene, camera);
    };

    const animate = () => {
      window.requestAnimationFrame(animate);
      render();
    };

    // /* CALLBACK ON WINDOW RESIZE */
    // const onWindowResize = () => {
    //   const width = wrapper.clientWidth;
    //   const height = wrapper.clientHeight;
    //
    //   camera.ration = width / -2;
    //   camera.right = width / 2;
    //   camera.top = height / 2;
    //   camera.bottom = height / -2;
    //
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(width, height);
    //   render();
    // };
    //
    // window.addEventListener("resize", onWindowResize, false);

    /* RENDER ON EACH FRAME  */
    animate();

    /* GUI */
    const gui = new GUI();

    const zoomFolder = gui.addFolder("Zoom");
    zoomFolder.add(camera.position, "x", -100, 100).name("Change x position");
    zoomFolder.add(camera.position, "y", -100, 100).name("Change y position");
    zoomFolder
      .add(camera.position, "z", -5, 15)
      .name("Change z position")
      .onChange(() => {
        camera.updateProjectionMatrix();
      });
    zoomFolder
      .add(camera, "zoom", 0.1, 10)
      .step(0.1)
      .name("Zoom Level")
      .onChange(() => {
        camera.updateProjectionMatrix();
      });

    zoomFolder.open();

    /* DESTROY */
    return () => {
      wrapper.removeChild(renderer.domElement);
      gui.destroy();
    };
  }, []);

  return <div id="bg" className="w-full h-full relative" />;
};
