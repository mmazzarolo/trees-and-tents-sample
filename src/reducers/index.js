/* @flow */
import { combineReducers } from "redux";

import gameReducer from "./gameReducer";
import boardReducer from "./boardReducer";
import routerReducer from "./routerReducer";

const reducers = {
  game: gameReducer,
  board: boardReducer,
  router: routerReducer
};

export const allReducers = reducers;

export default combineReducers(reducers);
