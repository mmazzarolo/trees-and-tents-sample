/* @flow */
import type { ReduxAction } from "../types/ReduxAction";
import type { BoardTileStatus } from "../types/BoardTileStatus";

export const updateTileStatus = (
  tileId: number,
  status: BoardTileStatus
): ReduxAction => {
  return {
    type: "UPDATE_TILE_STATUS",
    payload: { tileId, status }
  };
};
