/* @flow */
import type { Puzzle } from "./Puzzle";
import type { Route } from "./Route";
import type { BoardTileStatus } from "./BoardTileStatus";

export type Action =
  | { type: "START_GAME", payload: Puzzle }
  | { type: "END_GAME" }
  | { type: "GO_TO_SCREEN", payload: Route }
  | { type: "END_GAME" }
  | {
      type: "UPDATE_TILE_STATUS",
      payload: { tileId: number, status: BoardTileStatus }
    };
