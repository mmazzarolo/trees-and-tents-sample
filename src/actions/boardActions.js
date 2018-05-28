/* @flow */
import type { Action } from "../types/Action";
import type { BoardTileStatus } from "../types/BoardTileStatus";

export const updateTileStatus = (
  tileId: number,
  status: BoardTileStatus
): Action => {
  return {
    type: "UPDATE_TILE_STATUS",
    payload: { tileId, status }
  };
};
