"use client";

import { Canvas } from "@react-three/fiber";
import {
  Stats,
  Text,
  OrthographicCamera,
  CameraControls,
} from "@react-three/drei";
import { getRandomFloorItems } from "@/utils/floorplanItems";

export const RTFloorplan = () => {
  const items = getRandomFloorItems(1000);

  return (
    <div className="w-full h-full">
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 10]} />
        <CameraControls
          dollyToCursor={true}
          mouseButtons={{ left: 2, wheel: 16 }}
        />
        {items.map((item) => (
          <mesh key={item.data.id} position={[item.x, item.y, 1]}>
            <planeGeometry args={[item.width, item.height]} />
            <meshBasicMaterial color={item.color} />
            <Text color="black" anchorX="center" anchorY="middle" fontSize={10}>
              {item.data.title}
            </Text>
          </mesh>
        ))}
        <Stats />
      </Canvas>
    </div>
  );
};
