/* @flow */
import metrics from "../config/metrics";

const getTileSize = (tilesPerRow: number) => {
  return (metrics.SCREEN_WIDTH - metrics.DIGIT_SIZE * 2) / tilesPerRow;
};

export default getTileSize;
