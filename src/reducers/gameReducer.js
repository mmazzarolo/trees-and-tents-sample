/* @flow */
import type { ReduxAction } from "../types/ReduxAction";
import type { ReduxState } from "../types/ReduxState";
import type { GameStatus } from "../types/GameStatus";
import type { PuzzleDifficulty } from "../types/PuzzleDifficulty";
import type { PuzzleSize } from "../types/PuzzleSize";

// ===========================
//   STATE TYPE
// ===========================
export type GameState = {|
  +status: GameStatus,
  +puzzleDifficulty: PuzzleDifficulty,
  +puzzleSize: PuzzleSize
|};

// ===========================
//   INITIAL STATE
// ===========================
export const initialState: GameState = {
  status: "NEVER_PLAYED",
  puzzleDifficulty: "easy",
  puzzleSize: "6x6"
};

// ===========================
//   REDUCER
// ===========================
export default (
  state: GameState = initialState,
  action: ReduxAction
): GameState => {
  switch (action.type) {
    case "START_NEW_GAME": {
      const { difficulty, size } = action.payload;
      return {
        ...state,
        puzzleDifficulty: difficulty,
        puzzleSize: size,
        status: "PLAYING"
      };
    }
    case "START_NEW_GAME_WITH_CURRENT_SETTINGS": {
      return {
        ...state,
        status: "PLAYING"
      };
    }

    case "PAUSE_CURRENT_GAME": {
      return { ...state, status: "PAUSED" };
    }

    case "RESUME_CURRENT_GAME": {
      return { ...state, status: "PLAYING" };
    }

    default:
      return state;
  }
};

// ===========================
//   SELECTORS
// ===========================
export const getIsPlaying = (state: ReduxState): boolean => {
  return state.game.status === "PLAYING";
};
