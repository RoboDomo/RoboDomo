import Config from '../../../../Config'

import React from 'react'
import Label from 'react-bootstrap/lib/Label'

import MQTT from '../../../../lib/MQTT'
import Tile from '../Tile'

export default class Fan extends React.Component {
  constructor(props) {
    super(props)

    this.status_topic        = Config.mqtt.smartthings + '/' + props.name + '/'
    this.status_topic_length = this.status_topic.length
    this.set_topic           = this.status_topic

    this.onStateChange = this.onStateChange.bind(this)
    this.onClick       = this.onClick.bind(this)
  }

  renderSmall() {
    const state = this.state,
          props = this.props

    let value = 'Off',
        style = 'default'

    if (state.switch === 'on') {
      const level = Number(state.level)
      if (level < 34) {
        value = 'Low'
        style = 'primary'
      }
      else if (level < 67) {
        value = 'Medium'
        style = 'primary'
      }
      else {
        value = 'High'
        style = 'primary'
      }
    }
    return (
      <h3
        onClick={this.onClick}
      >
        {props.label}
        <Label
          style={{marginLeft: 10}}
          bsStyle={style}
        >
          {value}
        </Label>
      </h3>
    )
  }

  render() {
    const state = this.state,
          props = this.props

    if (!state || !state.switch || !state.level) {
      return null
    }
    if (Config.screenSize === 'small') {
      return this.renderSmall()
    }

    let value = 'Off'
    if (state.switch === 'on') {
      const level = Number(state.level)
      if (level < 34) {
        value = 'Low'
      }
      else if (level < 67) {
        value = 'Medium'
      }
      else {
        value = 'High'
      }
    }
    return (
      <Tile
        onClick={this.onClick}
        backgroundColor={value !== 'Off' ? 'yellow' : undefined}
      >
        <div style={{textAlign: 'center'}}>
          <div>{props.label}</div>
          <div style={{fontSize: 30, textAlign: 'center'}}>{value}</div>
        </div>
      </Tile>
    )
  }

  onClick() {
    const state = this.state

    // e.stopPropagation()

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
      console.log(this.set_topic + 'level/set', value)
      MQTT.publish(this.set_topic + 'level/set', value)
      MQTT.publish(this.set_topic + 'switch/set', 'on')
    }
    else {
      this.setState({
        switch: 'off'
      })
      console.log(this.set_topic + 'switch/set', 'off')
      MQTT.publish(this.set_topic + 'switch/set', 'off')
    }
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
}
