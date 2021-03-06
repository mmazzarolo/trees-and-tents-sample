/* @flow */
import cloneDeep from "lodash/cloneDeep";
import isBoardSolved from "./isBoardSolved";

import type { Board } from "../types/Board";
import type { BoardDigit } from "../types/BoardDigit";
import type { BoardTileStatus } from "../types/BoardTileStatus";

const updateDigitValidity = (digit: BoardDigit, boardSize: number) => {
  const numberOfEmpty = boardSize - (digit.tentsCounter + digit.treesCounter);
  return {
    ...digit,
    isValid:
      digit.signedAsTentsCounter <= digit.tentsCounter &&
      digit.signedAsEmptyCounter <= numberOfEmpty,
    isFilled:
      digit.signedAsTentsCounter === digit.tentsCounter &&
      digit.signedAsEmptyCounter === numberOfEmpty
  };
};

const updateBoard = (
  board: Board,
  updatedTileId: number,
  updatedTileStatus: BoardTileStatus
): Board => {
  const previousTileStatus = board.tiles[updatedTileId].status;
  const updatedBoard = cloneDeep(board);

  // Update the tile status
  updatedBoard.tiles[updatedTileId].status = updatedTileStatus;

  // Update the digits
  const updatedDigitRow = updatedBoard.tiles[updatedTileId].row;
  const updatedDigitCol = updatedBoard.tiles[updatedTileId].col;
  if (previousTileStatus === "SIGNED_AS_TENT") {
    updatedBoard.digitsX[updatedDigitRow].signedAsTentsCounter--;
    updatedBoard.digitsY[updatedDigitCol].signedAsTentsCounter--;
  } else if (previousTileStatus === "SIGNED_AS_EMPTY") {
    updatedBoard.digitsX[updatedDigitRow].signedAsEmptyCounter--;
    updatedBoard.digitsY[updatedDigitCol].signedAsEmptyCounter--;
  }
  if (updatedTileStatus === "SIGNED_AS_TENT") {
    updatedBoard.digitsX[updatedDigitRow].signedAsTentsCounter++;
    updatedBoard.digitsY[updatedDigitCol].signedAsTentsCounter++;
  } else if (updatedTileStatus === "SIGNED_AS_EMPTY") {
    updatedBoard.digitsX[updatedDigitRow].signedAsEmptyCounter++;
    updatedBoard.digitsY[updatedDigitCol].signedAsEmptyCounter++;
  }
  updatedBoard.digitsX[updatedDigitRow] = updateDigitValidity(
    updatedBoard.digitsX[updatedDigitRow],
    board.size
  );
  updatedBoard.digitsY[updatedDigitCol] = updateDigitValidity(
    updatedBoard.digitsY[updatedDigitCol],
    board.size
  );
  updatedBoard.isSolved = isBoardSolved(updatedBoard);
  return updatedBoard;
};

export default updateBoard;
