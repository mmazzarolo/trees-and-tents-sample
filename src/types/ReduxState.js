/* @flow */
import type { GameState } from "../reducers/gameReducer";
import type { BoardState } from "../reducers/boardReducer";
import type { RouterState } from "../reducers/routerReducer";

export type ReduxState = {
  game: GameState,
  board: BoardState,
  router: RouterState
};
