import Config from "../../../Config";
import React, { Component } from "react";
import MQTT from "../../../lib/MQTT";
import Tile from "./Tile";

export default class GarageDoorTile extends Component {
  constructor(props) {
    super(props);
    this.config = props.config;
    this.devices = this.config.devices;

    this.onStateChange = this.onStateChange.bind(this);
    this.state = {
      open: false,
      doors: {}
    };
  }
  onStateChange(topic, newState) {
    const devices = Array.isArray(this.devices) ? this.devices : [this.devices],
      newDoors = {};

    let open = false;
    for (const device of devices) {
      if (topic.indexOf(device) !== -1) {
        newDoors[device] = newState;
      } else {
        newDoors[device] = this.state.doors[device];
      }
      if (newDoors[device] !== "closed") {
        open = true;
      }
    }
    this.setState({
      open: open,
      doors: newDoors
    });
  }

  componentDidMount() {
    const devices = Array.isArray(this.devices) ? this.devices : [this.devices],
      preface = Config.mqtt.smartthings;

    for (const device of devices) {
      MQTT.subscribe(`${preface}/${device}/contact`, this.onStateChange);
    }
  }

  componentWillUnmount() {
    const devices = Array.isArray(this.devices) ? this.devices : [this.devices],
      preface = Config.mqtt.smartthings;

    for (const device of devices) {
      MQTT.unsubscribe(`${preface}/${device}/contact`, this.onStateChange);
    }
  }

  render() {
    const doors = [],
      d = this.state.doors,
      open = this.state.open;

    for (const k of Object.keys(d)) {
      doors.push({ name: k.replace(/\s+Sensor/, ""), state: d[k] });
    }

    let key = 0;
    return (
      <Tile>
        <div
          style={{
            flexDirection: "column",
            padding: 5,
            textAlign: "center",
            backgroundColor: open ? "red" : undefined,
            color: open ? "white" : undefined
          }}
        >
          {doors.map(function(door) {
            return (
              <div key={++key}>
                <span style={{ fontWeight: "bold" }}>{door.name}</span>
                <br />
                {door.state}
              </div>
            );
          })}
        </div>
      </Tile>
    );
  }
}
