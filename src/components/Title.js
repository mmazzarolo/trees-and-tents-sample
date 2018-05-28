/* @flow */
import * as React from "react";
import titleBackgroundImage from "../assets/images/title-background.png";

type Props = {};

class Title extends React.PureComponent<Props> {
  render() {
    return (
      <div className="Title">
        <h1
          className="Title-text"
          style={{ backgroundImage: `url("${titleBackgroundImage}")` }}
        >
          TREES<br />&<br />TENTS
        </h1>
      </div>
    );
  }
}

export default Title;
