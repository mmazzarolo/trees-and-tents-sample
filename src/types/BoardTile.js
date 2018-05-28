/* @flow */
import type { BoardTileValue } from "../types/BoardTileValue";
import type { BoardTileStatus } from "../types/BoardTileStatus";

export type BoardTile = {|
  id: number,
  row: number,
  col: number,
  value: BoardTileValue,
  status: BoardTileStatus,
  isValid: boolean
|};
