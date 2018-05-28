/* @flow */
import * as React from "react";
import { StyleSheet, View, PanResponder, findNodeHandle } from "react-native";
// $FlowFixMe
import NativeMethodsMixin from "NativeMethodsMixin";
import { connect } from "react-redux";
import chunk from "lodash/chunk";
import random from "lodash/random";
import Tile from "../components/Tile";
import Digit from "../components/Digit";
import * as routerActions from "../actions/routerActions";
import * as gameActions from "../actions/gameActions";
import * as boardActions from "../actions/boardActions";
import isPointInBoundingRect from "../utils/isPointInBoundingRect";
import getPuzzle from "../utils/getPuzzle";
import getTileSize from "../utils/getTileSize";
import delay from "../utils/delay";
import metrics from "../config/metrics";

import type { ReduxState } from "../types/ReduxState";
import type { ReactNativeViewRect } from "../types/ReactNativeViewRect";
import type { GameStatus } from "../types/GameStatus";
import type { BoardDigit } from "../types/BoardDigit";
import type { BoardTile } from "../types/BoardTile";

const SOLVED_ANIMATION_DURATION = 2000;

type Props = {
  status: GameStatus,
  tiles: BoardTile[],
  size: number,
  digitsX: BoardDigit[],
  digitsY: BoardDigit[],
  isSolved: boolean,
  updateTileStatus: typeof boardActions.updateTileStatus,
  startGame: typeof gameActions.startGame,
  goToScreen: typeof routerActions.goToScreen
};

const mapStateToProps = (state: ReduxState) => ({
  status: state.game.status,
  tiles: state.board.tiles,
  size: state.board.size,
  digitsX: state.board.digitsX,
  digitsY: state.board.digitsY,
  isSolved: state.board.isSolved
});

const mapDispatchToProps = {
  startGame: gameActions.startGame,
  updateTileStatus: boardActions.updateTileStatus,
  goToScreen: routerActions.goToScreen
};

class Game extends React.Component<Props> {
  isPointerDown: boolean = false;
  isInEmptyStreak: boolean = false;
  pointerDownTime: number = 0;
  // $FlowFixMe
  tilesRefs: (?Tile)[] = Array.from({ length: this.props.size });
  // $FlowFixMe
  tilesBoundigClientRects: (?ReactNativeViewRect)[] = Array.from({
    length: this.props.size
  });

  componentDidMount() {
    this.props.startGame(getPuzzle("easy", "6x6", random(9)));
  }

  componentDidUpdate(prevProps: Props) {
    const hasStartedPlaying =
      prevProps.status !== this.props.status && this.props.status === "PLAYING";
    if (hasStartedPlaying) {
      this.buildTilesBoundigClientRects();
    }

    const hasBeenSolved = !prevProps.isSolved && this.props.isSolved;
    if (hasBeenSolved) {
      setTimeout(() => {
        this.props.goToScreen("SUCCESS");
      }, SOLVED_ANIMATION_DURATION);
    }
  }

  buildTilesBoundigClientRects = async () => {
    await delay(1);
    this.tilesRefs.forEach((tileRef, index) => {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(tileRef),
        (x, y, width, height) => {
          const rect = { x, y, width, height };
          this.tilesBoundigClientRects[index] = rect;
        }
      );
    });
  };

  boardPanResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      return gestureState.dx !== 0 && gestureState.dy !== 0;
    },

    onPanResponderMove: (evt, gestureState) => {
      this.handleTouchMove(gestureState.moveX, gestureState.moveY);
    }
  });

  handleTouchMove = (x: number, y: number) => {
    const point = { x, y };
    this.tilesBoundigClientRects.some((boundingClientRect, index) => {
      if (!boundingClientRect) return false;
      const isPointerInTile = isPointInBoundingRect(point, boundingClientRect);
      if (isPointerInTile) {
        const hoveredTileref = this.props.tiles[index];
        this.handleTilePointerEnter(hoveredTileref);
        return true;
      }
      return false;
    });
  };

  handleTilePointerUp = (tile: BoardTile) => {
    if (tile.status === "TREE") {
      return;
    }
    if (tile.status === "PRISTINE" || tile.status === "UNSIGNED") {
      this.props.updateTileStatus(tile.id, "SIGNED_AS_EMPTY");
    } else if (tile.status === "SIGNED_AS_EMPTY") {
      this.props.updateTileStatus(tile.id, "SIGNED_AS_TENT");
    } else if (tile.status === "SIGNED_AS_TENT") {
      this.props.updateTileStatus(tile.id, "UNSIGNED");
    } else {
      this.props.updateTileStatus(tile.id, "UNSIGNED");
    }
  };

  handleTilePointerEnter = (tile: BoardTile) => {
    this.isInEmptyStreak = true;
    if (tile.status === "PRISTINE" || tile.status === "UNSIGNED") {
      this.props.updateTileStatus(tile.id, "SIGNED_AS_EMPTY");
    }
  };

  render() {
    const { tiles, size, digitsX, digitsY } = this.props;
    const tilesByRows = chunk(tiles, size);

    const tileSize = getTileSize(size);

    // Map tiles to React elements (Tile)
    const boardCells = tilesByRows.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        const tile = col;
        return (
          <Tile
            key={`tile-${colIndex}-${colIndex}`}
            ref={ref => {
              if (ref) {
                this.tilesRefs[tile.id] = ref;
              }
            }}
            id={tile.id}
            width={tileSize}
            height={tileSize}
            onPress={() => this.handleTilePointerUp(tile)}
            isValid={tile.isValid}
            status={tile.status}
          />
        );
      });
    });

    // Add X digits on the right side of the board
    boardCells.forEach((row, index) => {
      const digit = digitsX[index];
      row.push(
        <Digit
          key={`digit_x_${index}`}
          height={tileSize}
          width={metrics.DIGIT_SIZE}
          numberOfTents={digit.numberOfTents}
          isValid={digit.isValid}
          isFilled={digit.isFilled}
        />
      );
    });

    // Add Y digits to the bottom of the board (and the bottom-right empty cell)
    const bottomDigits = digitsY.map((digit, index) => {
      return (
        <Digit
          key={`digit_y_${index}`}
          width={tileSize}
          height={metrics.DIGIT_SIZE}
          numberOfTents={digit.numberOfTents}
          isValid={digit.isValid}
          isFilled={digit.isFilled}
        />
      );
    });
    bottomDigits.push(
      <Digit
        key={`last-cell`}
        height={metrics.DIGIT_SIZE}
        width={metrics.DIGIT_SIZE}
      />
    );
    boardCells.push(bottomDigits);

    return (
      <View style={styles.container} {...this.boardPanResponder.panHandlers}>
        <View style={styles.board}>
          {boardCells.map((row, rowIndex) => {
            return (
              <View style={styles.boardRow} key={`board-row-${rowIndex}`}>
                {row}
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  board: {
    marginLeft: metrics.DIGIT_SIZE / 2,
    marginTop: metrics.DIGIT_SIZE / 2
  },
  boardRow: {
    flexDirection: "row"
  }
});
