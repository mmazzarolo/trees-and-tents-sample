/* @flow */
import puzzles from "../config/puzzles";

import type { PuzzleDifficulty } from "../types/PuzzleDifficulty";
import type { PuzzleSize } from "../types/PuzzleSize";
import type { Puzzle } from "../types/Puzzle";

const getPuzzle = (
  id: number,
  difficulty: PuzzleDifficulty,
  size: PuzzleSize
): Puzzle => {
  return puzzles[difficulty][size][id];
};

export default getPuzzle;
