/* @flow */
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import reducers from "../reducers/index";
import constants from "../config/constants";

import type { ReduxState } from "../types/ReduxState";

const createReduxStore = (initialState?: ReduxState) => {
  const middlewares = [];

  if (!constants.IS_ENV_PROD) {
    const loggerMiddleware = createLogger({
      collapsed: true,
      duration: true
    });
    middlewares.push(loggerMiddleware);
  }

  middlewares.push(thunkMiddleware);

  const middlewareConfig = applyMiddleware(...middlewares);

  const store = createStore(reducers, middlewareConfig);

  return store;
};

export default createReduxStore;
