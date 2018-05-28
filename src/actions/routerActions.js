/* @flow */
import type { Action } from "../types/Action";
import type { Route } from "../types/Route";

export const goToScreen = (route: Route): Action => {
  return {
    type: "GO_TO_SCREEN",
    payload: route
  };
};
