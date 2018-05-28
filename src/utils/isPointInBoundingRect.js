/* @flow */
type Point = {
  x: number,
  y: number
};

const isPointInBoundingRect = (point: Point, rect: ClientRect): boolean => {
  return !(
    rect.right < point.x ||
    rect.left > point.x ||
    rect.bottom < point.y ||
    rect.top > point.y
  );
};

export default isPointInBoundingRect;
