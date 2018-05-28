/* @flow */
import type { Action } from "../types/Action";
import type { ReduxState } from "../types/ReduxState";
import type { GameStatus } from "../types/GameStatus";

// ===========================
//   STATE TYPE
// ===========================
export type GameState = {|
  +status: GameStatus
|};

// ===========================
//   INITIAL STATE
// ===========================
export const initialState: GameState = {
  status: "STOPPED"
};

// ===========================
//   REDUCER
// ===========================
export default (state: GameState = initialState, action: Action): GameState => {
  switch (action.type) {
    case "START_GAME": {
      return {
        ...state,
        status: "PLAYING"
      };
    }

    case "END_GAME": {
      return { ...state, status: "STOPPED" };
    }

    default:
      return state;
  }
};

// ===========================
//   SELECTORS
// ===========================
export const getIsPlaying = (state: ReduxState): boolean => {
  return state.game.status === "PLAYING";
};
