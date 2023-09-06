"use client";
import PathPlanner from "@/canvas";
import { useEffect, useRef } from "react";
import { IPathPlanner } from "@/canvas/types/models";
import { Tools } from "@/canvas/types/tools";

const CANVAS_ID = "path-planner";

const TOOLS = [
  {
    type: Tools.Point,
  },
  {
    type: Tools.Line,
  },
  {
    type: Tools.Move,
  },
];

export default function Page() {
  const pathPlannerRef = useRef<IPathPlanner | null>(null);

  useEffect(() => {
    pathPlannerRef.current = new PathPlanner({
      canvasId: CANVAS_ID,
    });
  }, []);

  const changeTool = (tool: Tools) => {
    pathPlannerRef.current?.setTool(tool);
  };

  const clearCanvas = () => {
    pathPlannerRef.current?.clear();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2">
        {TOOLS.map((tool) => {
          return (
            <button
              key={tool.type}
              className="bg-blue-600 text-white p-2 rounded-md text-center mb-2"
              onClick={() => changeTool(tool.type)}
            >
              {tool.type}
            </button>
          );
        })}
        <button
          className="bg-green-700 text-white p-2 rounded-md text-center mb-2"
          onClick={clearCanvas}
        >
          Clear
        </button>
      </div>
      <div className="flex-grow">
        <canvas id={CANVAS_ID} />
      </div>
    </div>
  );
}
