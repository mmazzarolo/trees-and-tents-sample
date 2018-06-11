/* @flow */
import buildBoard from "../utils/buildBoard";
import updateBoard from "../utils/updateBoard";

import type { Board } from "../types/Board";
import type { ReduxAction } from "../types/ReduxAction";
import type { ReduxState } from "../types/ReduxState";

// ===========================
//   STATE TYPE
// ===========================
export type BoardState = Board;

// ===========================
//   INITIAL STATE
// ===========================
export const initialState: BoardState = {
  tiles: [],
  digitsX: [],
  digitsY: [],
  size: 0,
  isSolved: false
};

// ===========================
//   REDUCER
// ===========================
export default (
  state: BoardState = initialState,
  action: ReduxAction
): BoardState => {
  switch (action.type) {
    case "START_NEW_GAME":
    case "START_NEW_GAME_WITH_CURRENT_SETTINGS": {
      const puzzle = action.payload.puzzle;
      const newBoardState = buildBoard(puzzle);
      return newBoardState;
    }

    case "UPDATE_TILE_STATUS": {
      const { tileId, status } = action.payload;
      const updatedBoardState = updateBoard(state, tileId, status);
      return updatedBoardState;
    }

    default:
      return state;
  }
};

// ===========================
//   SELECTORS
// ===========================
export const getTentsCounter = (state: ReduxState) => {
  return state.board.tiles.reduce((counter, tile) => {
    return counter + (tile.value === "TENT" ? 1 : 0);
  }, 0);
};
