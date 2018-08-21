import Config from "../../../Config";
import React, { Component } from "react";

import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Tile from "./Tile";

export default class LinkTile extends Component {
  constructor(props) {
    super(props);

    this.onStateChange = this.onStateChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  renderSmall() {
    const props = this.props;

    return (
      <div
        style={{
          width: "100%",
          height: 60,
          fontSize: 32,
          fontWeight: "bold",
          clear: "both",
          padding: 8,
          borderBottom: "1px solid black"
        }}
        onClick={this.onClick}
      >
        <div style={{ float: "right" }}>
          <Glyphicon glyph="chevron-right" />
        </div>
        <div style={{ float: "left" }} onClick={this.onClick}>
          {props.label}
        </div>
      </div>
    );
  }

  render() {
    if (Config.screenSize === "small") {
      return this.renderSmall();
    }

    const props = this.props;

    return <Tile onClick={props.onClick}>{props.label}</Tile>;
  }

  onStateChange(data) {
    this.setState(data);
  }

  onClick(e) {
    e.stopPropagation();

    const props = this.props;
    window.location.hash = props.href;
  }
}
