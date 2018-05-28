/* @flow */
import * as React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
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

import type { ReduxState } from "../types/ReduxState";
import type { BoardDigit } from "../types/BoardDigit";
import type { BoardTile } from "../types/BoardTile";
import type { PointerEvent } from "../types/PointerEvent";

const SOLVED_ANIMATION_DURATION = 2000;

type Props = {
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
  tilesRefs: (?Tile)[] = [];
  tilesBoundigClientRects: (?ClientRect)[] = [];

  componentDidMount() {
    this.props.startGame(getPuzzle("easy", "6x6", random(9)));
  }

  componentDidUpdate(prevProps: Props) {
    // this.tilesBoundigClientRects = this.tilesRefs.map(tileRef => {
    //   const tileDOMNode = ReactDom.findDOMNode(tileRef);
    //   return tileDOMNode &&
    //     typeof tileDOMNode.getBoundingClientRect === "function"
    //     ? tileDOMNode.getBoundingClientRect()
    //     : null;
    // });
    const hasBeenSolved = !prevProps.isSolved && this.props.isSolved;
    if (hasBeenSolved) {
      setTimeout(() => {
        this.props.goToScreen("SUCCESS");
      }, SOLVED_ANIMATION_DURATION);
    }
  }

  handleBoardPointerUp = (e: PointerEvent) => {
    console.debug("handleBoardPointerUp", e);
    this.isPointerDown = false;
  };

  handleBoardPointerMove = (e: MouseEvent) => {
    this.tilesBoundigClientRects.some((boundingClientRect, index) => {
      if (!boundingClientRect) return false;
      const point = { x: e.clientX, y: e.clientY };
      const isPointerInTile = isPointInBoundingRect(point, boundingClientRect);
      if (isPointerInTile) {
        const hoveredTileref = this.props.tiles[index];
        this.handleTilePointerEnter(null, hoveredTileref);
        return true;
      }
      return false;
    });
  };

  handleBoardContextMenu = (e: Event) => {
    e.preventDefault();
  };

  handleTilePointerDown = (e: PointerEvent, tile: BoardTile) => {
    console.debug("handleTilePointerDown", tile.id);
    this.isPointerDown = true;
    this.pointerDownTime = Date.now();
  };

  handleTilePointerUp = (tile: BoardTile) => {
    console.debug("handleTilePointerUp", tile.id);
    this.isPointerDown = false;
    if (this.isInEmptyStreak) {
      this.isInEmptyStreak = false;
      return;
    }
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

  handleTilePointerEnter = (e: ?PointerEvent, tile: BoardTile) => {
    console.debug("handleTilePointerEnter", tile.id);
    if (this.isPointerDown) {
      this.isInEmptyStreak = true;
      if (tile.status === "PRISTINE" || tile.status === "UNSIGNED") {
        this.props.updateTileStatus(tile.id, "SIGNED_AS_EMPTY");
      }
    }
  };

  handleTilePointerLeave = (e: ?PointerEvent, tile: BoardTile) => {
    console.debug("handleTilePointerLeave", tile.id);
    if (this.isPointerDown) {
      this.isInEmptyStreak = true;
      if (tile.status === "PRISTINE" || tile.status === "UNSIGNED") {
        this.props.updateTileStatus(tile.id, "SIGNED_AS_EMPTY");
      }
    }
  };

  render() {
    const { tiles, size, digitsX, digitsY, isSolved } = this.props;
    const tilesByRows = chunk(tiles, size);

    const tilesRefsTemp = Array.from({ length: size });

    // Map tiles to React elements (Tile)
    const boardCells = tilesByRows.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        const tile = col;
        return (
          <Tile
            key={`tile-${colIndex}-${colIndex}`}
            ref={ref => {
              if (ref) {
                // $FlowFixMe
                tilesRefsTemp[tile.id] = ref;
              }
            }}
            id={tile.id}
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
          numberOfTents={digit.numberOfTents}
          isValid={digit.isValid}
          isFilled={digit.isFilled}
        />
      );
    });
    bottomDigits.push(<Digit key={`last-cell`} />);
    boardCells.push(bottomDigits);

    // Render the board
    let className = "Game";
    if (isSolved) {
      className = `${className} Game-solved`;
    }
    return (
      <View style={styles.container}>
        {boardCells.map((row, rowIndex) => {
          return (
            <View style={styles.boardRow} key={`board-row-${rowIndex}`}>
              {row}
            </View>
          );
        })}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);

const styles = StyleSheet.create({
  container: {},
  boardRow: { flexDirection: "row" }
});
