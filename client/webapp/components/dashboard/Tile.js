//import Config from '../../../Config';
import React, { Component } from "react";

const WIDTH = Math.min(window.innerWidth, 1024);
const COLUMNS = window.innerWidth < 800 ? 2 : 8;
const SIZE = parseInt(WIDTH / COLUMNS, 10);

export default class Tile extends Component {
  state: {
    pressed: false
  };
  constructor(props) {
    super(props);

    this.width = (props.width || 1) * SIZE;
    this.height = (props.height || 1) * SIZE;

    this.onClick = this.onClick.bind(this);
  }

  render() {
    const props = this.props,
      state = this.state || {};
    //if (Config.screenSize === 'small') {
    //  return (
    //    <div
    //      style={{textAlign: 'center', padding: 5, borderBottom: '1px solid black', minHeight: 60}}
    //      onClick={this.onClick}
    //    >
    //      {this.props.children}
    //    </div>
    //  )
    //}
    return (
      <div
        style={{
          float: "left",
          width: this.width,
          height: this.height,
          backgroundColor: props.backgroundColor || undefined,
          color: props.color || undefined,
          border: state.pressed ? "4px inset" : "4px outset",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={this.onClick}
      >
        {this.renderInner ? this.renderInner() : props.children}
      </div>
    );
  }

  onClick() {
    if (this.timer) {
      return;
    }
    this.timer = setTimeout(() => {
      this.timer = null;
      this.setState({ pressed: false });
      const ref = this.props.onClick;
      if (typeof ref === "string") {
        window.location.hash = ref;
      } else if (typeof ref === "function") {
        ref();
      }
    }, 750);
    this.setState({ pressed: true });
  }
}
