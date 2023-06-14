import { FC } from "react";
import { Routes } from "@/utils/routes";
import Link from "next/link";

const LINKS = [
  {
    href: Routes.SimpleCubeThreeJs,
    text: "Simple cube (three.js)",
  },
  {
    href: Routes.CubeGui,
    text: "Cube (three.js + gui)",
  },
  {
    href: Routes.RayCasterSpheres,
    text: "Spheres (raycaster)",
  },
  {
    href: Routes.FloorPlan,
    text: "Floorplan",
  },
];

export const Nav: FC = () => {
  return (
    <nav className="flex flex-col h-full bg-white p-6">
      {LINKS.map(({ href, text }) => (
        <Link
          key={href}
          href={href}
          className="block bg-blue-600 text-white p-2 rounded-md text-center mb-2"
        >
          {text}
        </Link>
      ))}
      <a
        className="mt-auto block bg-blue-600 text-white p-2 rounded-md text-center mb-2"
        href="https://github.com/AlexZakablukov/three-js"
        target="_blank"
        rel="noreferrer"
      >
        GITHUB
      </a>
    </nav>
  );
};
