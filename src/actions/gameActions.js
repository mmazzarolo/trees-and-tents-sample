/* @flow */
import type { Action } from "../types/Action";
import type { Puzzle } from "../types/Puzzle";

export const startGame = (puzzle: Puzzle): Action => {
  return {
    type: "START_GAME",
    payload: puzzle
  };
};
