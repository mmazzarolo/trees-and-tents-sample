/* @flow */
import puzzles from "../config/puzzles";

import type { PuzzleDifficulty } from "../types/PuzzleDifficulty";
import type { PuzzleSize } from "../types/PuzzleSize";
import type { Puzzle } from "../types/Puzzle";

const getPuzzle = (
  difficulty: PuzzleDifficulty,
  size: PuzzleSize,
  index: number
): Puzzle => {
  return puzzles[difficulty][size][index];
};

export default getPuzzle;
