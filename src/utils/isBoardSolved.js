/* @flow */
import type { Board } from "../types/Board";

const isBoardSolved = (board: Board): boolean => {
  // We break the .some condition as soon as we see that the board is not solved
  const isUnsolved = board.tiles.some(tile => {
    if (tile.value === "TENT" && tile.status !== "SIGNED_AS_TENT") {
      return true;
    } else if (tile.value === "EMPTY" && tile.status !== "SIGNED_AS_EMPTY") {
      return true;
    }
    return false;
  });
  return !isUnsolved;
};

export default isBoardSolved;
