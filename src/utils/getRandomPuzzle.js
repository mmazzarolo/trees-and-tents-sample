/* @flow */
import random from "lodash/random";
import getPuzzle from "./getPuzzle";
import puzzles from "../config/puzzles";

import type { PuzzleDifficulty } from "../types/PuzzleDifficulty";
import type { PuzzleSize } from "../types/PuzzleSize";
import type { Puzzle } from "../types/Puzzle";

const getRandomPuzzle = (
  difficulty: PuzzleDifficulty,
  size: PuzzleSize
): { id: number, puzzle: Puzzle } => {
  const puzzleId = random(puzzles[difficulty][size].length - 1);
  return {
    id: puzzleId,
    puzzle: getPuzzle(puzzleId, difficulty, size)
  };
};

export default getRandomPuzzle;
