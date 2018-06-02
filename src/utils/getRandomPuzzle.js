/* @flow */
import random from "lodash/random";
import puzzles from "../config/puzzles";

import type { PuzzleDifficulty } from "../types/PuzzleDifficulty";
import type { PuzzleSize } from "../types/PuzzleSize";
import type { Puzzle } from "../types/Puzzle";

const getRandomPuzzle = (
  difficulty: PuzzleDifficulty,
  size: PuzzleSize
): Puzzle => {
  const puzzleId = random(puzzles[difficulty][size].length - 1);
  return puzzles[difficulty][size][puzzleId];
};

export default getRandomPuzzle;
