/* @flow */
import type { PuzzleTile } from "./PuzzleTile";
import type { PuzzleDigit } from "./PuzzleDigit";

export type Puzzle = {
  tiles: PuzzleTile[],
  digitsX: PuzzleDigit[],
  digitsY: PuzzleDigit[]
};
