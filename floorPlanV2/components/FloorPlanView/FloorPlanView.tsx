"use client";
import { FC, useRef, useEffect } from "react";
import PropTypes, { Validator } from "prop-types";
import { IFloorPlanItem } from "../../types/floorPlanItem";
import { floorPlanItemPropType } from "../../prop-types/floorPlanItem";
import { FloorPlanViewer } from "../../models/FloorPlanViewer";

interface IFloorPlanViewProps {
  items: IFloorPlanItem[];
  backgroundImage?: string;
}

/**
 * FloorPlanView component displays a floor plan view with items and a background image.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {IFloorPlanItem[]} props.items - The items to be displayed on the floor plan.
 * @param {string} [props.backgroundImage] - The URL of the background image for the floor plan.
 * @returns {JSX.Element} The rendered FloorPlanView component.
 */
export const FloorPlanView: FC<IFloorPlanViewProps> = ({
  items,
  backgroundImage,
}) => {
  const floorPlanRef = useRef<FloorPlanViewer | null>(null);

  useEffect(() => {
    floorPlanRef.current = new FloorPlanViewer({
      canvasContainerId: "floorPlan",
      backgroundImage,
      items,
    });

    return () => {
      if (floorPlanRef.current === null) {
        return;
      }
      floorPlanRef.current.destroy();
    };
  }, [items, backgroundImage]);

  return (
    <div
      id="floorPlan"
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
};

FloorPlanView.propTypes = {
  items: PropTypes.arrayOf(floorPlanItemPropType.isRequired)
    .isRequired as Validator<IFloorPlanItem[]>,
  backgroundImage: PropTypes.string,
};
