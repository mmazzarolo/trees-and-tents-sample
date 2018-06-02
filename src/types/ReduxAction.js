/* @flow */
import type { Puzzle } from "./Puzzle";
import type { PuzzleDifficulty } from "./PuzzleDifficulty";
import type { PuzzleSize } from "./PuzzleSize";
import type { Route } from "./Route";
import type { BoardTileStatus } from "./BoardTileStatus";

export type ReduxAction =
  | { type: "START_GAME", payload: Puzzle }
  | {
      type: "SET_PUZZLE_INFO",
      payload: { difficulty: PuzzleDifficulty, size: PuzzleSize }
    }
  | { type: "END_GAME" }
  | { type: "GO_TO_SCREEN", payload: Route }
  | { type: "END_GAME" }
  | {
      type: "UPDATE_TILE_STATUS",
      payload: { tileId: number, status: BoardTileStatus }
    };
