/* @flow */
import type { ReactNativeViewRect } from "../types/ReactNativeViewRect";
type Point = {
  x: number,
  y: number
};

const isPointInBoundingRect = (
  point: Point,
  rect: ReactNativeViewRect
): boolean => {
  return (
    rect.x <= point.x &&
    point.x <= rect.x + rect.width &&
    rect.y <= point.y &&
    point.y <= rect.y + rect.height
  );
};

export default isPointInBoundingRect;
