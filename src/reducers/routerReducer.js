/* @flow */
import keys from "../config/keys";

import type { ReduxAction } from "../types/ReduxAction";
import type { ReduxState } from "../types/ReduxState";
import type { Route } from "../types/Route";

// ===========================
//   STATE TYPE
// ===========================
export type RouterState = {|
  +currentRoute: Route
|};

// ===========================
//   INITIAL STATE
// ===========================
export const initialState: RouterState = {
  currentRoute: keys.INITIAL_ROUTE
};

// ===========================
//   REDUCER
// ===========================
export default (
  state: RouterState = initialState,
  action: ReduxAction
): RouterState => {
  switch (action.type) {
    case "GO_TO_SCREEN":
      return { ...state, currentRoute: action.payload };

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
