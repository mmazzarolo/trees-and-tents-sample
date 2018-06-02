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
  status: "STOPPED",
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
    case "START_GAME": {
      return { ...state, status: "PLAYING" };
    }

    case "END_GAME": {
      return { ...state, status: "STOPPED" };
    }

    case "SET_PUZZLE_INFO": {
      const { difficulty, size } = action.payload;
      return { ...state, puzzleDifficulty: difficulty, puzzleSize: size };
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
