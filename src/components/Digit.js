/* @flow */
import * as React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../components/Text";

type Props = {
  numberOfTents: ?number,
  isValid: ?boolean,
  isFilled: ?boolean
};

class Digit extends React.Component<Props> {
  static defaultProps = {
    numberOfTents: null,
    isValid: true,
    isFilled: false
  };

  shouldComponentUpdate(prevProps: Props) {
    const didValidChange = prevProps.isValid !== this.props.isValid;
    const didFilledChange = prevProps.isFilled !== this.props.isFilled;
    if (didValidChange || didFilledChange) {
      return true;
    }
    return false;
  }

  render() {
    const { numberOfTents, isValid, isFilled } = this.props;
    let className = `Digit`;
    if (!isValid) className = `${className} Digit-invalid`;
    if (isFilled) className = `${className} Digit-filled`;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {numberOfTents !== null && numberOfTents !== undefined
            ? numberOfTents
            : ""}
        </Text>
      </View>
    );
  }
}

export default Digit;

const styles = StyleSheet.create({
  container: {},
  treeImage: { width: 20, height: 20 },
  tentImage: { width: 20, height: 20 }
});
