// Base class for MQTT buttons
//  can be instantiated directly if api prop is provided

import React, { Component } from "react";
import Config from "../Config";
import Button from "react-bootstrap/lib/Button";
import MQTT from "../lib/MQTT";

export default class MQTTButton extends Component {
  constructor(props) {
    super();
    this.device = props.device;
    this.isEnabled = props.enabled === undefined || props.enabled;
    this.state = {
      buttonStyle:
        props.buttonStyle !== null
          ? Object.assign({}, Config.ui.buttonStyle, props.buttonStyle || {})
          : {},
      buttonSize:
        props.buttonStyle !== null
          ? props.buttonSize || Config.ui.buttonSize
          : undefined,
      enabled: this.isEnabled
    };
    this.onClick = ::this.onClick;
  }

  render() {
    return (
      <Button
        style={this.state.buttonStyle}
        bsStyle={this.props.bsStyle}
        bsSize={this.state.buttonSize}
        onClick={this.onClick}
      >
        {this.props.children}
      </Button>
    );
  }

  onClick(e) {
    e.stopPropagation();
    const props = this.props;

    // this.setState({ enabled: false })
    MQTT.publish(props.topic, props.value);
    // this.setState({ enabled: this.isEnabled })
    return false;
  }
}
