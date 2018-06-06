/* @flow */
import keys from "../config/keys";

import type { ReduxAction } from "../types/ReduxAction";
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

    case "GO_TO_MENU_SCREEN":
      return { ...state, currentRoute: "MENU" };
    case "GO_TO_STAGE_SELECTION_SCREEN":
      return { ...state, currentRoute: "STAGE_SELECTION" };
    case "GO_TO_GAME_SCREEN":
      return { ...state, currentRoute: "GAME" };
    case "GO_TO_SOLVED_SCREEN":
      return { ...state, currentRoute: "SOLVED" };

    default:
      return state;
  }
};

// ===========================
//   SELECTORS
// ===========================
