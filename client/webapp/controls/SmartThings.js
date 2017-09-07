import Config from '../../Config'

import React from 'react'

import Form from 'react-bootstrap/lib/Form'

import ToggleField from '../components/form/ToggleField'
import DimmerField from '../components/smartthings/DimmerField'
import FanField from '../components/smartthings/FanField'

import MQTT from '../../lib/MQTT'

const styles = {
  container: {
    width: '100%',
  },
}

const fanValues = {
  low:    25,
  medium: 50,
  high:   75
}

const title = <h1>SmartThings</h1>

export default class SmartThings extends React.Component {
  constructor(props) {
    super()
    this.state         = null

    this.status_topic = Config.mqtt.smartthings + '/'
    this.status_topic_length = this.status_topic.length
    this.set_topic = Config.mqtt.smartthings + '/'

    this.room          = props.room
    this.onStateChange = this.onStateChange.bind(this)
  }

  render() {
    if (!this.state) {
      return null
    }
    let ndx    = 0
    const name = this.room.name
    return (
      <Form style={{marginTop: 30}} horizontal>
        {this.room.things.map((thing) => {
          return this.renderThing(thing, name, ndx++)
        })}
      </Form>
    )
  }

  renderThing(thing, room, ndx) {
    const key = room + '-' + thing.name + '-' + ndx

    switch (thing.type) {
      case 'switch':
        return (
          <ToggleField
            key={key}
            name={thing.name}
            label={thing.name}
            toggled={this.state[`${thing.name}/switch`] === 'on'}
            onToggle={this.toggleSwitch.bind(this)}
          />
        )
      case 'dimmer':
        return (
          <DimmerField
            key={key}
            name={thing.name}
            label={thing.name}
            toggled={this.state[`${thing.name}/switch`] === 'on'}
            value={this.state[`${thing.name}/level`]}
            onToggle={this.onDimmerToggled.bind(this)}
            onSliderChange={this.onDimmerSlider.bind(this)}
          />
        )
      case 'fan':
        return (
          <FanField
            key={key}
            name={thing.name}
            label={thing.name}
            toggled={this.state[`${thing.name}/switch`] === 'on'}
            value={this.state[`${thing.name}/level`]}
            onChange={this.onFanChange.bind(this)}
          />
        )
      case 'motion':
        return null
      case 'button':
        return null
      case 'presence':
        return null
      default:
        return null
                // return (
                //     <div key={key}>Unknown {thing.type}</div>
                // )
    }
  }

  control(name, value) {
    console.log('control', name, value)
    const state = {}
    state[name] = value
    this.setState(state)
    MQTT.publish(this.set_topic +  name + '/set', value)
  }

  toggleSwitch(name, state, field) {
    this.control(`${name}/switch`, state ? 'on' : 'off')
  }

  onDimmerToggled(name, state, field) {
    this.control(`${name}/switch`, state ? 'on' : 'off')
  }

  onDimmerSlider(name, value, field) {
    this.control(`${name}/level`, value)
  }

  onFanChange(name, state, field) {
    if (state === 'off') {
      this.control(`${name}/switch`, 'off')
    }
    else {
      const value = fanValues[state]
      this.control(`${name}/switch`, 'on')
      this.control(`${name}/level`, value)
    }
  }

  onStateChange(topic, newState) {
    const newVal = {}

    newVal[topic.substr(this.status_topic_length)] = newState
    this.setState(newVal)
  }

  componentDidMount() {
    this.room.things.forEach((thing) => {
      switch (thing.type) {
        case 'dimmer':
          MQTT.subscribe(this.status_topic + thing.name + '/switch', this.onStateChange)
          MQTT.subscribe(this.status_topic + thing.name + '/level', this.onStateChange)
          break
        case 'fan':
          MQTT.subscribe(this.status_topic + thing.name + '/switch', this.onStateChange)
          MQTT.subscribe(this.status_topic + thing.name + '/level', this.onStateChange)
          break
        case 'switch':
          MQTT.subscribe(this.status_topic + thing.name + '/switch', this.onStateChange)
          break
        case 'motion':
          MQTT.subscribe(this.status_topic + thing.name + '/motion', this.onStateChange)
          break
        case 'presence':
          MQTT.subscribe(this.status_topic + thing.name + '/presence', this.onStateChange)
          break
        case 'button':
          MQTT.subscribe(this.status_topic + thing.name + '/pressed', this.onStateChange)
          break
      }
    })
  }

  componentWillUnmount() {
    this.room.things.forEach((thing) => {
      switch (thing.type) {
        case 'dimmer':
          MQTT.unsubscribe(this.status_topic + thing.name + '/switch', this.onStateChange)
          MQTT.unsubscribe(this.status_topic + thing.name + '/level', this.onStateChange)
          break
        case 'fan':
          MQTT.unsubscribe(this.status_topic + thing.name + '/switch', this.onStateChange)
          MQTT.unsubscribe(this.status_topic + thing.name + '/level', this.onStateChange)
          break
        case 'switch':
          MQTT.unsubscribe(this.status_topic + thing.name + '/switch', this.onStateChange)
          break
        case 'motion':
          MQTT.unsubscribe(this.status_topic + thing.name + '/motion', this.onStateChange)
          break
        case 'presence':
          MQTT.unsubscribe(this.status_topic + thing.name + '/presence', this.onStateChange)
          break
        case 'button':
          MQTT.unsubscribe(this.status_topic + thing.name + '/pressed', this.onStateChange)
          break
      }
    })
  }
}
