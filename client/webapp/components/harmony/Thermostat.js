import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Config from '../../../Config'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import MQTT from '../../../lib/MQTT'

const topics = [
  'away', 'ambient_temperature_f', 'target_temperature_f', 'hvac_state', 'has_leaf'
]

const UP = <Glyphicon glyph="chevron-up"/>,
      DOWN = <Glyphicon glyph="chevron-down"/>

export default class Thermostat extends Component {
  constructor(props) {
    super()

    this.name = props.name
    this.state = {
      buttonStyle:           Object.assign({}, Config.ui.buttonStyle, props.buttonStyle || {}),
      buttonSize:            props.buttonSize || Config.ui.buttonSize,
      enabled:               this.isEnabled,
      ambient_temperature_f: 72,
      target_temperature_f:  80,
      hvac_state:            'off'
    }

    this.status_topic        = Config.mqtt.nest + '/' + this.name + '/status/'
    this.status_topic_length = this.status_topic.length
    this.set_topic           = this.status_topic.replace('status', 'set')

    this.onStateChange = ::this.onStateChange
  }

  render() {
    const color = this.state.hvac_state === 'cooling' ? 'blue': undefined
    return (
      <div>
        <Button
          style={this.state.buttonStyle}
          bsStyle={this.props.bsStyle}
          bsSize={this.state.buttonSize}
          onClick={::this.onUpClick}
          ref={(buttonDOM) => { this.upButtonDOM = buttonDOM }}
        >
          {UP}
        </Button>
        <div style={{textAlign: 'center', color: color, fontSize: 24}}>{this.state.target_temperature_f}&deg;</div>
        <Button
          style={this.state.buttonStyle}
          bsStyle={this.props.bsStyle}
          bsSize={this.state.buttonSize}
          onClick={::this.onDownClick}
          ref={(buttonDOM) => { this.downButtonDOM = buttonDOM }}
        >
          {DOWN}
        </Button>
      </div>
    )
  }

  onUpClick(e) {
    const newTemperature = this.state.target_temperature_f + 1

    this.setState({
      target_temperature_f: newTemperature
    })
    this.setTargetTemperature(newTemperature)
    e.preventDefault()
  }

  onDownClick(e) {
    const newTemperature = this.state.target_temperature_f - 1

    this.setState({
      target_temperature_f: newTemperature
    })
    this.setTargetTemperature(newTemperature)
    e.preventDefault()
  }

  onStateChange(topic, newState) {
    const key = topic.substr(this.status_topic_length),
          newValue = {}

    newValue[key] = newState
    this.setState(newValue)
  }

  componentDidMount() {
    const status_topic = this.status_topic

    topics.forEach((topic) => {
      MQTT.subscribe(status_topic + topic, this.onStateChange)
    })
  }

  componentWillUnmount() {
    const status_topic = this.status_topic

    topics.forEach((topic) => {
      MQTT.unsubscribe(status_topic + topic, this.onStateChange)
    })
  }

  setTargetTemperature(temp) {
    MQTT.publish(this.set_topic + '/target_temperature_f', temp)
  }
}
