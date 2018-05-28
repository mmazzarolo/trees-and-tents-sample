/* @flow */
export type PointerEvent = {|
  pointerId: number,
  pointerType: "mouse" | "touch" | "pen",
  which: 0 | 1 | 2 | 3
|};
