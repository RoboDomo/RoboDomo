import Config from "../../../Config";
import React from "react";

import Tile from "./Tile";
import MQTT from "../../../lib/MQTT";

import SwitchIcon from "react-icons/lib/ti/flash";

export default class MacroTile extends React.Component {
  constructor(props) {
    super(props);
    this.config = props.config;
    this.label = this.config.label;
    this.name = this.config.name;
    this.topic = `${Config.mqtt.macros}/run`;
    this.onClick = this.onClick.bind(this);

    this.state = { backgroundColor: "white" };
  }

  render() {
    //backgroundColor={this.state.backgroundColor}
    return (
      <Tile onClick={this.onClick}>
        <div style={{ flexDirection: "column" }}>
          <div style={{ fontSize: 24, textAlign: "center", marginBottom: 10 }}>
            <SwitchIcon />
          </div>
          <div style={{ textAlign: "center" }}>{"Macro"}</div>
          <div>{this.config.label}</div>
        </div>
      </Tile>
    );
  }

  onClick() {
    MQTT.publish(this.topic, this.name);
    this.setState({ backgroundColor: "cyan" });
    setTimeout(() => {
      this.setState({ backgroundColor: undefined });
    }, 250);
  }
}
