import { IFloorPlanThreeJsItem } from "@/lib/FloorPlanThreeJs";

const randomBetween = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

const randomColor = (): string => {
  const r = randomBetween(0, 255);
  const g = randomBetween(0, 255);
  const b = randomBetween(0, 255);
  const rgb = `rgb(${r},${g},${b})`;
  return rgb;
};

export const getRandomFloorItems = (count: number = 10) => {
  let items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      width: randomBetween(0, 200),
      height: randomBetween(0, 100),
      x: randomBetween(-5000, 5000),
      y: randomBetween(-5000, 5000),
      color: randomColor(),
      data: {
        id: i.toString(),
        title: `Stant ${i}`,
      },
    });
  }
  return items;
};

export const FLOOR_PLAN_ITEMS: IFloorPlanThreeJsItem[] = [
  {
    width: 200,
    height: 100,
    x: -250,
    y: 150,
    color: "red",
    data: {
      id: "1",
      title: "Stand 1",
    },
  },
  {
    width: 200,
    height: 50,
    x: 0,
    y: 175,
    color: "green",
    data: {
      id: "2",
      title: "Stand 2",
    },
  },
  {
    width: 200,
    height: 150,
    x: 250,
    y: 125,
    color: "blue",
    data: {
      id: "3",
      title: "Stand 3",
    },
  },
  {
    width: 100,
    height: 150,
    x: -300,
    y: 0,
    color: "blue",
    data: {
      id: "4",
      title: "Stand 4",
    },
  },
];
