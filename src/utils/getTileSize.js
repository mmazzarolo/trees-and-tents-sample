/* @flow */
import metrics from "../config/metrics";

const getTileSize = (tilesPerRow: number) => {
  return (
    (metrics.SCREEN_WIDTH -
      metrics.DIGIT_SIZE * 2 -
      metrics.TILE_BORDER_WIDTH * (tilesPerRow * 2) -
      metrics.TILE_MARGIN * tilesPerRow) /
    tilesPerRow
  );
};

export default getTileSize;
