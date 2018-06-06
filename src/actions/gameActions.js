/* @flow */
import getRandomPuzzle from "../utils/getRandomPuzzle";

import type { ReduxAction } from "../types/ReduxAction";
import type { ReduxDispatch } from "../types/ReduxDispatch";
import type { ReduxGetState } from "../types/ReduxGetState";
import type { PuzzleDifficulty } from "../types/PuzzleDifficulty";
import type { PuzzleSize } from "../types/PuzzleSize";

export const startNewGame = (
  difficulty: PuzzleDifficulty,
  size: PuzzleSize
) => {
  const puzzle = getRandomPuzzle(difficulty, size);
  return {
    type: "START_NEW_GAME",
    payload: { difficulty, size, puzzle }
  };
};

export const pauseCurrentGame = (): ReduxAction => {
  return {
    type: "PAUSE_CURRENT_GAME"
  };
};
export const resumeCurrentGame = (): ReduxAction => {
  return {
    type: "RESUME_CURRENT_GAME"
  };
};

export const startNewGameWithCurrentSettings = () => {
  return (dispatch: ReduxDispatch, getState: ReduxGetState) => {
    const { puzzleDifficulty, puzzleSize } = getState().game;
    const puzzle = getRandomPuzzle(puzzleDifficulty, puzzleSize);
    dispatch({
      type: "START_NEW_GAME_WITH_CURRENT_SETTINGS",
      payload: { puzzle }
    });
  };
};
