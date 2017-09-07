// Base class for MQTT buttons
//  can be instantiated directly if api prop is provided

import React from 'react'
import Config from '../Config'
import Button from 'react-bootstrap/lib/Button'
import MQTT from '../lib/MQTT'

export default class MQTTButton extends React.Component {
  constructor(props) {
    super()
    this.device = props.device
    this.isEnabled = props.enabled === undefined || props.enabled
    this.state = {
      buttonStyle: Object.assign({}, Config.ui.buttonStyle, props.buttonStyle || {}),
      buttonSize:  props.buttonSize || Config.ui.buttonSize,
      enabled:     this.isEnabled
    }
    this.onClick = this.onClick.bind(this)
  }

  render() {
    return (
      <Button
        style={this.state.buttonStyle}
        bsStyle={this.props.bsStyle}
        bsSize={this.state.buttonSize}
        onClick={this.onClick.bind(this)}
      >
        {this.props.children}
      </Button>
    )
  }

  onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    const props = this.props

    // this.setState({ enabled: false })
    MQTT.publish(props.topic, props.value)
    // this.setState({ enabled: this.isEnabled })
  }
}
