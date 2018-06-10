/* @flow */
import * as React from "react";
import {
  Animated,
  Image,
  StyleSheet,
  View,
  PanResponder,
  findNodeHandle
} from "react-native";
// $FlowFixMe
import NativeMethodsMixin from "NativeMethodsMixin";
import { connect } from "react-redux";
import chunk from "lodash/chunk";
import Tile from "../components/Tile";
import Digit from "../components/Digit";
import Button from "../components/Button";
import Timer from "../components/Timer";
import TentsCounter from "../components/TentsCounter";
import * as routerActions from "../actions/routerActions";
import * as gameActions from "../actions/gameActions";
import * as boardActions from "../actions/boardActions";
import isPointInBoundingRect from "../utils/isPointInBoundingRect";
import getTileSize from "../utils/getTileSize";
import delay from "../utils/delay";
import device from "../config/device";
import metrics from "../config/metrics";
import arrowLeftImage from "../assets/images/arrow-left.png";

import type { ReduxState } from "../types/ReduxState";
import type { ReactNativeViewRect } from "../types/ReactNativeViewRect";
import type { GameStatus } from "../types/GameStatus";
import type { BoardDigit } from "../types/BoardDigit";
import type { BoardTile } from "../types/BoardTile";

const SOLVED_ANIMATION_DURATION = 2000;
const BOARD_ANIM_VALUE_DURATION = 400;

type Props = {
  status: GameStatus,
  tiles: BoardTile[],
  size: number,
  digitsX: BoardDigit[],
  digitsY: BoardDigit[],
  isSolved: boolean,
  updateTileStatus: typeof boardActions.updateTileStatus,
  pauseCurrentGame: typeof gameActions.pauseCurrentGame,
  goToMenuScreen: typeof routerActions.goToMenuScreen,
  goToSolvedScreen: typeof routerActions.goToSolvedScreen
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
  updateTileStatus: boardActions.updateTileStatus,
  pauseCurrentGame: gameActions.pauseCurrentGame,
  goToMenuScreen: routerActions.goToMenuScreen,
  goToSolvedScreen: routerActions.goToSolvedScreen
};

class Game extends React.Component<Props> {
  boardAnimValue: Animated.Value = new Animated.Value(0);
  firstHoveredTile: ?BoardTile = null;
  lastHoveredTile: ?BoardTile = null;
  isHovering: boolean = false;
  // $FlowFixMe
  tilesRefs: (?Tile)[] = Array.from({ length: this.props.size });
  // $FlowFixMe
  tilesBoundigClientRects: (?ReactNativeViewRect)[] = Array.from({
    length: this.props.size
  });

  componentDidMount() {
    this.buildTilesBoundigClientRects();
    Animated.timing(this.boardAnimValue, {
      toValue: 1,
      duration: BOARD_ANIM_VALUE_DURATION,
      useNativeDriver: true
    }).start();
  }

  componentDidUpdate(prevProps: Props) {
    const hasBeenSolved = !prevProps.isSolved && this.props.isSolved;
    if (hasBeenSolved) {
      setTimeout(this.props.goToSolvedScreen, SOLVED_ANIMATION_DURATION);
    }
  }

  buildTilesBoundigClientRects = async () => {
    await delay(10);
    this.tilesRefs.forEach((tileRef, index) => {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(tileRef),
        (x, y, width, height) => {
          const rect = { x, y: device.IS_ANDROID ? y - 24 : y, width, height };
          this.tilesBoundigClientRects[index] = rect;
        }
      );
    });
  };

  boardPanResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      return true;
    },

    onPanResponderMove: (evt, gestureState) => {
      this.handleTouchMove(gestureState.moveX, gestureState.moveY);
    },
    onPanResponderRelease: (evg, gestureState) => {
      this.firstHoveredTile = null;
      this.lastHoveredTile = null;
      this.isHovering = false;
    }
  });

  handleTouchMove = (x: number, y: number) => {
    const point = { x, y };
    if (this.lastHoveredTile) {
      const lastHoveredTileRect = this.tilesBoundigClientRects[
        this.lastHoveredTile.id
      ];
      const isStillInSameTile = isPointInBoundingRect(
        point,
        lastHoveredTileRect
      );
      if (isStillInSameTile) {
        return;
      }
    }
    this.tilesBoundigClientRects.some((boundingClientRect, index) => {
      if (!boundingClientRect) return false;
      const isPointerInTile = isPointInBoundingRect(point, boundingClientRect);
      if (isPointerInTile) {
        const hoveredTile = this.props.tiles[index];
        this.lastHoveredTile = hoveredTile;
        if (!this.isHovering) {
          this.isHovering = true;
          this.firstHoveredTile = hoveredTile;
        } else if (hoveredTile !== this.firstHoveredTile) {
          if (this.firstHoveredTile) {
            this.handleTilePointerEnter(this.firstHoveredTile);
          }
          this.firstHoveredTile = null;
          this.handleTilePointerEnter(hoveredTile);
        }
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
    if (tile.status === "PRISTINE" || tile.status === "UNSIGNED") {
      this.props.updateTileStatus(tile.id, "SIGNED_AS_EMPTY");
    }
  };

  handleBackButtonPress = () => {
    this.props.pauseCurrentGame();
    this.props.goToMenuScreen();
  };

  render() {
    const { tiles, size, digitsX, digitsY, isSolved } = this.props;
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
            isBoardSolved={isSolved}
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
          tentsCounter={digit.tentsCounter}
          isValid={digit.isValid}
          isFilled={digit.isFilled}
          isVisible={digit.isVisible}
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
          tentsCounter={digit.tentsCounter}
          isValid={digit.isValid}
          isFilled={digit.isFilled}
          isVisible={digit.isVisible}
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
      <Animated.View
        style={[styles.container, { opacity: this.boardAnimValue }]}
      >
        {/* <View style={styles.header}>
          <TentsCounter isVisible={true} counter={3} />
          <Timer isVisible={true} counter={3} />
        </View> */}
        <Animated.View style={styles.board}>
          {boardCells.map((row, rowIndex) => {
            return (
              <View style={styles.boardRow} key={`board-row-${rowIndex}`}>
                {row}
              </View>
            );
          })}
        </Animated.View>
        <View style={styles.footer}>
          <Button
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.handleBackButtonPress}
            label={"Back"}
            backgroundColors={["#808080", "#808080"]}
            leftElement={
              <Image source={arrowLeftImage} style={styles.buttonImage} />
            }
            height={36}
          />
        </View>
      </Animated.View>
    );
  }
}

// {...this.boardPanResponder.panHandlers}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "#F5F5F5"
  },
  board: {
    marginLeft: metrics.DIGIT_SIZE / 2,
    marginTop: metrics.DIGIT_SIZE / 2
  },
  boardRow: {
    flexDirection: "row"
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 30,
    marginHorizontal: 30
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 30,
    marginHorizontal: 30
  },
  button: {
    width: "24%"
  },
  buttonText: {
    fontSize: 16
  },
  buttonImage: {
    width: 16,
    height: 16
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
