/* @flow */
import getRandomPuzzle from "../utils/getRandomPuzzle";

import type { ReduxAction } from "../types/ReduxAction";
import type { PuzzleDifficulty } from "../types/PuzzleDifficulty";
import type { PuzzleSize } from "../types/PuzzleSize";
import type { ReduxDispatch } from "../types/ReduxDispatch";
import type { ReduxGetState } from "../types/ReduxGetState";

export const startGame = () => {
  return (dispatch: ReduxDispatch, getState: ReduxGetState) => {
    const { puzzleDifficulty, puzzleSize } = getState().game;
    const puzzle = getRandomPuzzle(puzzleDifficulty, puzzleSize);
    dispatch({
      type: "START_GAME",
      payload: puzzle
    });
  };
};

export const setPuzzleInfo = (
  difficulty: PuzzleDifficulty,
  size: PuzzleSize
): ReduxAction => {
  return {
    type: "SET_PUZZLE_INFO",
    payload: { difficulty, size }
  };
};
