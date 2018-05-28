/* @flow */
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import reducers from "../reducers/index";

import type { ReduxState } from "../types/ReduxState";

const createReduxStore = (initialState?: ReduxState) => {
  const loggerMiddleware = createLogger({
    collapsed: true,
    duration: true
  });

  const middlewares = applyMiddleware(loggerMiddleware);

  const store = createStore(reducers, middlewares);

  return store;
};

export default createReduxStore;
