import React, { Component } from "react";

import Form from "react-bootstrap/lib/Form";

import Fan from "./things/Fan";
import Dimmer from "./things/Dimmer";
import Switch from "./things/Switch";

import Tile from "./Tile";

const fanValues = {
  low: 25,
  medium: 50,
  high: 75
};

export default class SmartThingsTile extends Component {
  constructor(props) {
    super(props);

    this.thing = props.control;
    this.tile = props.tile;
    this.title = this.tile.title;
    this.onStateChange = this.onStateChange.bind(this);
  }

  renderThing(thing, room, ndx) {
    const key = room + "-" + thing.name + "-" + ndx,
      name = thing.device;

    switch (thing.type) {
      case "switch":
        return <Switch key={key} name={name} label={name} />;
      case "dimmer":
        return (
          <Dimmer
            key={key}
            name={name}
            label={name}
            onChange={this.onFanChange.bind(this)}
            onToggle={this.onDimmerToggled.bind(this)}
            onSliderChange={this.onDimmerSlider.bind(this)}
          />
        );
      case "fan":
        return (
          <Fan
            key={key}
            name={name}
            label={name}
            onChange={this.onFanChange.bind(this)}
          />
        );
      case "motion":
        return null;
      case "button":
        return null;
      case "presence":
        return null;
      default:
        return null;
      // return case(
      //     <div>Unknown {thing.type}</div>
      // )
    }
  }

  render() {
    return (
      <Tile onClick="things">
        <Form style={{ marginTop: 10 }}>{this.renderThing(this.thing)}</Form>
      </Tile>
    );
  }

  onStateChange(newState) {
    this.setState(newState);
  }

  componentDidMount() {
    // MQTT.subscribe()
  }

  componentWillUnmount() {}

  async control(name, value) {
    const state = {};
    state[name] = value;
    this.setState(state);
  }

  toggleSwitch(name, state /*, field */) {
    this.control(`${name}/switch`, state ? "on" : "off");
  }

  onDimmerToggled(name, state /*, field */) {
    this.control(`${name}/switch`, state ? "on" : "off");
  }

  onDimmerSlider(name, value /*, field */) {
    this.control(`${name}/level`, value);
  }

  onFanChange(name, state) {
    if (state === "off") {
      this.control(`${name}/switch`, "off");
    } else {
      const value = fanValues[state];
      this.control(`${name}/switch`, "on");
      this.control(`${name}/level`, value);
    }
  }
}
