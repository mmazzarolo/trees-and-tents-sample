/* @flow */
import type { ReduxAction } from "../types/ReduxAction";
import type { Route } from "../types/Route";

export const goToScreen = (route: Route): ReduxAction => {
  return {
    type: "GO_TO_SCREEN",
    payload: route
  };
};

export const goToMenuScreen = (): ReduxAction => {
  return { type: "GO_TO_MENU_SCREEN" };
};

export const goToStageSelectionScreen = (): ReduxAction => {
  return { type: "GO_TO_STAGE_SELECTION_SCREEN" };
};

export const goToGameScreen = (): ReduxAction => {
  return { type: "GO_TO_GAME_SCREEN" };
};

export const goToSolvedScreen = (): ReduxAction => {
  return { type: "GO_TO_SOLVED_SCREEN" };
};
