/* @flow */
import type { ReduxAction } from "../types/ReduxAction";
import type { Route } from "../types/Route";

export const goToScreen = (route: Route): ReduxAction => {
  return {
    type: "GO_TO_SCREEN",
    payload: route
  };
};
