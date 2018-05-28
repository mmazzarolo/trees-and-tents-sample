/* @flow */
import type { BoardTile } from "../types/BoardTile";
import type { BoardDigit } from "../types/BoardDigit";

export type Board = {|
  tiles: BoardTile[],
  digitsX: BoardDigit[],
  digitsY: BoardDigit[],
  size: number,
  isSolved: boolean
|};
