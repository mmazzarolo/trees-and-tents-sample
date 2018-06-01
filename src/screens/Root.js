/* @flow */
import * as React from "react";
import { UIManager } from "react-native";
import { Provider } from "react-redux";
import { Font } from "expo";
import Router from "../screens/Router";
import createReduxStore from "../utils/createReduxStore";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const store = createReduxStore();

type State = {
  isInitialized: boolean
};

class Root extends React.Component<{}, State> {
  state = {
    isInitialized: false
  };

  componentDidMount() {
    this.initializeApp();
  }

  initializeApp = async () => {
    await Font.loadAsync({
      "baloochettan-regular": require("../assets/fonts/BalooChettan-Regular.ttf")
    });
    this.setState({ isInitialized: true });
  };

  render() {
    if (!this.state.isInitialized) {
      return null;
    } else {
      return (
        <Provider store={store}>
          <Router />
        </Provider>
      );
    }
  }
}

export default Root;
