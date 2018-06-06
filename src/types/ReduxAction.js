/* @flow */
import type { Puzzle } from "./Puzzle";
import type { PuzzleDifficulty } from "./PuzzleDifficulty";
import type { PuzzleSize } from "./PuzzleSize";
import type { Route } from "./Route";
import type { BoardTileStatus } from "./BoardTileStatus";

export type ReduxAction =
  | { type: "GO_TO_SCREEN", payload: Route }
  | { type: "GO_TO_MENU_SCREEN" }
  | { type: "GO_TO_STAGE_SELECTION_SCREEN" }
  | { type: "GO_TO_GAME_SCREEN" }
  | { type: "GO_TO_SOLVED_SCREEN" }
  | {
      type: "START_NEW_GAME",
      payload: {
        puzzle: Puzzle,
        difficulty: PuzzleDifficulty,
        size: PuzzleSize
      }
    }
  | {
      type: "START_NEW_GAME_WITH_CURRENT_SETTINGS",
      payload: { puzzle: Puzzle }
    }
  | { type: "PAUSE_CURRENT_GAME" }
  | { type: "RESUME_CURRENT_GAME" }
  | {
      type: "UPDATE_TILE_STATUS",
      payload: { tileId: number, status: BoardTileStatus }
    };
