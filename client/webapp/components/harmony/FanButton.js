import React, {Component} from 'react'

import Config from '../../../Config'
import Button from 'react-bootstrap/lib/Button'

import MQTT from '../../../lib/MQTT'

export default class FanButton extends Component {
  constructor(props) {
    super()

    this.name = props.name
    this.status_topic        = Config.mqtt.smartthings + '/' + this.name + '/'
    this.status_topic_length = this.status_topic.length
    this.set_topic = this.status_topic

    this.state = {
      buttonStyle: Object.assign({}, Config.ui.buttonStyle, props.buttonStyle || {}),
      buttonSize:  props.buttonSize || Config.ui.buttonSize,
      enabled:     this.isEnabled,
      switch:      'off',
      level:       0
    }

    this.onStateChange = ::this.onStateChange
  }

  getValue() {
    const state = this.state,
          sw = state.switch,
          level = state.level

    if (sw === 'off') {
      return 'Off'
    }
    else if (level >= 67) {
      return 'High'
    }
    else if (level >= 33) {
      return 'Medium'
    }
    else {
      return 'Low'
    }
  }

  render() {
    return (
      <div>
        <Button
          style={this.state.buttonStyle}
          bsStyle={this.props.bsStyle}
          bsSize={this.state.buttonSize}
          onClick={::this.onClick}
        >
          {this.getValue()}
        </Button>
      </div>
    )
  }

  onStateChange(topic, newState) {
    const newVal = {}

    newVal[topic.substr(this.status_topic_length)] = newState
    this.setState(newVal)
  }

  componentDidMount() {
    MQTT.subscribe(this.status_topic + 'switch', this.onStateChange)
    MQTT.subscribe(this.status_topic + 'level', this.onStateChange)
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.status_topic + 'switch', this.onStateChange)
    MQTT.unsubscribe(this.status_topic + 'level', this.onStateChange)
  }
  onClick(e) {
    const state = this.state

    e.stopPropagation()

    let value = 25,
        level = Number(state.level)

    if (state.switch === 'off') {
      level = 25
    }
    else if (level < 34) {
      value = 50
    }
    else if (level < 67) {
      value = 75
    }
    else {
      value = 0
    }

    if (value) {
      this.setState({
        level:  value,
        switch: 'on'
      })
      MQTT.publish(this.set_topic + 'switch/set', 'on')
      MQTT.publish(this.set_topic + 'level/set', value)
    }
    else {
      this.setState({
        switch: 'off'
      })
      MQTT.publish(this.set_topic + 'switch/set', 'off')
    }
  }
}
