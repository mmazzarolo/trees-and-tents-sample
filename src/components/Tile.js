/* @flow */
import * as React from "react";
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import tentImage from "../assets/images/tent.png";
import treeImage from "../assets/images/tree.png";

import type { PointerEvent } from "../types/PointerEvent";
import type { BoardTileStatus } from "../types/BoardTileStatus";

const SPAWN_DELAY_MS = 400;

type Props = {
  id: number,
  status: BoardTileStatus,
  isValid: boolean,
  onPress: () => mixed
};

class Tile extends React.Component<Props> {
  shouldComponentUpdate(prevProps: Props) {
    const didStatusChange = prevProps.status !== this.props.status;
    const didValidChange = prevProps.isValid !== this.props.isValid;
    if (didStatusChange || didValidChange) {
      return true;
    }
    return false;
  }

  render() {
    const { id, status, isValid, onPress } = this.props;
    const animationDelay =
      status === "TREE" || status === "PRISTINE"
        ? `${SPAWN_DELAY_MS + id * 20}ms`
        : undefined;
    let tileContent;
    let className;
    if (status === "PRISTINE") {
      tileContent = "";
      className = "Tile Tile-pristine";
    } else if (status === "TREE") {
      tileContent = <Image source={treeImage} style={styles.treeImage} />;
      className = "Tile Tile-tree";
    } else if (status === "SIGNED_AS_TENT") {
      tileContent = <Image source={tentImage} style={styles.tentImage} />;
      className = "Tile Tile-tent";
    } else if (status === "SIGNED_AS_EMPTY") {
      tileContent = "";
      className = "Tile Tile-empty";
    } else {
      tileContent = "";
      className = "Tile Tile-unsigned";
    }
    if (!isValid) {
      className = `${className} Tile-invalid`;
    }
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.content}>{tileContent ? tileContent : null}</View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Tile;

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    backgroundColor: "green",
    margin: 2
  },
  content: { width: 20, height: 20 },
  treeImage: { width: 20, height: 20 },
  tentImage: { width: 20, height: 20 }
});
