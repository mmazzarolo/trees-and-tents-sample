/* @flow */
import type { Puzzle } from "../types/Puzzle";
import type { Board } from "../types/Board";

const TREE_SYMBOL = "#";
const TENT_SYMBOL = "*";

const initialDigitState = {
  tentsCounter: 0,
  treesCounter: 0,
  signedAsTentsCounter: 0,
  signedAsEmptyCounter: 0,
  isValid: true,
  isFilled: false,
  isVisible: false
};

const buildBoard = (puzzle: Puzzle): Board => {
  const size = Math.sqrt(puzzle.tiles.length);
  const tiles = [];
  const digitsX = puzzle.digitsX.map(x => {
    return { ...initialDigitState, isVisible: x !== null };
  });
  const digitsY = Array.from({ length: size }).map(x => {
    return { ...initialDigitState, isVisible: x !== null };
  });
  puzzle.tiles.forEach((puzzleTile, index) => {
    const row = Math.floor(index / size);
    const col = index % size;
    const id = index;
    let value;
    if (puzzleTile === TREE_SYMBOL) {
      value = "TREE";
    } else if (puzzleTile === TENT_SYMBOL) {
      value = "TENT";
    } else {
      value = "EMPTY";
    }
    const status = value === "TREE" ? "TREE" : "PRISTINE";
    const isValid = true;
    const tile = { id, value, row, col, status, isValid };
    tiles[index] = tile;
    if (tile.value === "TENT") {
      digitsX[row].tentsCounter++;
      digitsY[col].tentsCounter++;
    } else if (tile.value === "TREE") {
      digitsX[row].treesCounter++;
      digitsY[col].treesCounter++;
    }
  });
  return {
    size: size,
    tiles,
    digitsX,
    digitsY,
    isSolved: false
  };
};

export default buildBoard;
