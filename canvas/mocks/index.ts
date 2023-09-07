import Point from "@/canvas/entities/Point";
import Connection from "@/canvas/entities/Connection";
import { IConnection, IPoint } from "@/canvas/types/entities";

export const points: IPoint[] = [
  new Point({
    id: "A",
    x: 50,
    y: 50,
  }),
  new Point({
    id: "B",
    x: 300,
    y: 40,
  }),
  new Point({
    id: "C",
    x: 40,
    y: 300,
  }),
  new Point({
    id: "D",
    x: 350,
    y: 250,
  }),
];

export const connections: IConnection[] = [
  new Connection({
    id: "1",
    pointIds: ["A", "D"],
  }),
  new Connection({
    id: "2",
    pointIds: ["B", "C"],
  }),
];
