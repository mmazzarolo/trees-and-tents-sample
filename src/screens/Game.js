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
import { getTentsCounter } from "../reducers/boardReducer";
import Tile from "../components/Tile";
import Digit from "../components/Digit";
import Button from "../components/Button";
import * as routerActions from "../actions/routerActions";
import * as gameActions from "../actions/gameActions";
import * as boardActions from "../actions/boardActions";
import isPointInBoundingRect from "../utils/isPointInBoundingRect";
import getTileSize from "../utils/getTileSize";
import delay from "../utils/delay";
import colors from "../config/colors";
import device from "../config/device";
import metrics from "../config/metrics";
import barsImage from "../assets/images/bars.png";
import refreshImage from "../assets/images/refresh.png";

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
  tentsCounter: number,
  updateTileStatus: typeof boardActions.updateTileStatus,
  pauseCurrentGame: typeof gameActions.pauseCurrentGame,
  resetCurrentGame: typeof gameActions.resetCurrentGame,
  goToMenuScreen: typeof routerActions.goToMenuScreen,
  goToSolvedScreen: typeof routerActions.goToSolvedScreen
};

const mapStateToProps = (state: ReduxState) => ({
  status: state.game.status,
  tiles: state.board.tiles,
  size: state.board.size,
  digitsX: state.board.digitsX,
  digitsY: state.board.digitsY,
  isSolved: state.board.isSolved,
  tentsCounter: getTentsCounter(state)
});

const mapDispatchToProps = {
  resetCurrentGame: gameActions.resetCurrentGame,
  updateTileStatus: boardActions.updateTileStatus,
  pauseCurrentGame: gameActions.pauseCurrentGame,
  goToMenuScreen: routerActions.goToMenuScreen,
  goToSolvedScreen: routerActions.goToSolvedScreen
};

class Game extends React.Component<Props> {
  boardAnimValue: Animated.Value = new Animated.Value(0);
  solveAnimValue: Animated.Value = new Animated.Value(0);
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
      Animated.timing(this.solveAnimValue, {
        toValue: 1,
        duration: SOLVED_ANIMATION_DURATION,
        useNativeDriver: true
      }).start();
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

  findTileByCoord = (x: number, y: number): ?BoardTile => {
    let tile = null;
    this.tilesBoundigClientRects.some((boundingClientRect, index) => {
      if (!boundingClientRect) return false;
      const point = { x, y };
      const isPointerInTile = isPointInBoundingRect(point, boundingClientRect);
      if (isPointerInTile) {
        tile = this.props.tiles[index];
        return true;
      }
      return false;
    });
    return tile;
  };

  boardPanResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: (evt, gestureState) => {
      const tile = this.findTileByCoord(
        evt.nativeEvent.pageX,
        evt.nativeEvent.pageY
      );
      if (tile && ["PRISTINE", "UNSIGNED"].includes(tile.status)) {
        return true;
      }
      return false;
    },
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      const tile = this.findTileByCoord(gestureState.moveX, gestureState.moveY);
      if (tile && ["PRISTINE", "UNSIGNED"].includes(tile.status)) {
        return true;
      }
      return false;
    },

    onPanResponderMove: (evt, gestureState) => {
      this.handleTouchMove(gestureState.moveX, gestureState.moveY);
    },
    onPanResponderRelease: (evg, gestureState) => {
      if (
        this.firstHoveredTile &&
        this.lastHoveredTile &&
        this.firstHoveredTile.id === this.lastHoveredTile.id
      ) {
        const tileRef = this.tilesRefs[this.firstHoveredTile.id];
        tileRef.simulatePress();
      }
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
    const hoveredTile = this.findTileByCoord(x, y);
    if (hoveredTile) {
      this.lastHoveredTile = hoveredTile;
      if (!this.isHovering) {
        this.isHovering = true;
        this.firstHoveredTile = hoveredTile;
      } else if (
        hoveredTile !== this.firstHoveredTile &&
        ["PRISTINE", "UNSIGNED"].includes(hoveredTile.status)
      ) {
        if (this.firstHoveredTile) {
          const firstHoveredTileRef = this.tilesRefs[this.firstHoveredTile.id];
          firstHoveredTileRef.simulatePress();
        }
        this.firstHoveredTile = null;
        const hoveredTileRef = this.tilesRefs[hoveredTile.id];
        hoveredTileRef.simulatePress();
      }
    }
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
    const {
      tiles,
      size,
      digitsX,
      digitsY,
      isSolved,
      resetCurrentGame
    } = this.props;
    const tilesByRows = chunk(tiles, size);

    const tileSize = getTileSize(size);
    const tileSizePlusPadding =
      tileSize + metrics.TILE_BORDER_WIDTH * 2 + metrics.TILE_MARGIN;

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
          height={tileSizePlusPadding}
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
          width={tileSizePlusPadding}
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

    const footerOpacity = this.solveAnimValue.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [1, 0, 0],
      extrapolate: "clamp"
    });

    return (
      <Animated.View
        style={[styles.container, { opacity: this.boardAnimValue }]}
      >
        <Animated.View style={styles.board}>
          {boardCells.map((row, rowIndex) => {
            return (
              <View style={styles.boardRow} key={`board-row-${rowIndex}`}>
                {row}
              </View>
            );
          })}
        </Animated.View>
        <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
          <Button
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.handleBackButtonPress}
            label={"Menu"}
            backgroundColor={colors.GRAY}
            leftElement={
              <Image source={barsImage} style={styles.buttonImage} />
            }
            height={36}
          />
          <Button
            style={[styles.button]}
            textStyle={styles.buttonText}
            onPress={resetCurrentGame}
            label={"Reset"}
            backgroundColor={colors.GRAY}
            leftElement={
              <Image source={refreshImage} style={styles.buttonImage} />
            }
            height={36}
          />
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: metrics.SCREEN_HEIGHT * 0.15
  },
  board: {
    marginLeft: metrics.DIGIT_SIZE,
    marginTop: metrics.DIGIT_SIZE
  },
  boardRow: {
    flexDirection: "row"
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
    paddingHorizontal: 30
  },
  button: {
    width: "34%"
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
