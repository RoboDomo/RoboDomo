import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Config from '../Config'

import ListItem from 'material-ui/List'
import Toggle from 'material-ui/Toggle'
import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField'

import MQTT from '../lib/MQTT'

export default class Dimmer extends Component {
  state = {
    switch: 'off',
    level:  0
  }

  constructor({thing}) {
    super()
    this.thing = thing
    this.switch_topic = [Config.mqtt.smartthings, this.thing.name, 'switch'].join('/')
    this.level_topic = this.switch_topic.replace('switch', 'level')
    this.handleMessage = ::this.handleMessage // this.handleMessage.bind(this)
  }

  render() {
    const state = this.state

    if (Config.screenSize === 'small') {
      return (
        <ListItem style={{display: 'flex'}}>
          <Toggle
            label={this.thing.name}
            style={{width: 220, marginRight: 50 }}
            toggled={state.switch !== 'off'}
            onToggle={(e, checked) => {
              MQTT.publish(this.switch_topic + '/set', checked ? 'on': 'off')
            }}
          />
          <TextField
            id={this.thing.name.toLowerCase().replace(/ /g, '-')}
            style={{
              flex:      1, 
              //marginLeft: 50, 
              marginTop: -14
            }}
            type="number"
            value={state.level}
            onChange={(e, value) => {
              if (value === '') {
                this.setState({ level: value })
                return
              }
              value = Number(value)
              if (value >= 0 && value <= 100) {
                this.setState({ level: value })
                MQTT.publish(this.level_topic + '/set', this.state.level)
              } 
            }}
          />
        </ListItem>
      )
    }
    return (
      <ListItem style={{display: 'flex'}}>
        <Toggle
          label={this.thing.name}
          style={{width: 220, marginRight: 50 }}
          toggled={state.switch !== 'off'}
          onToggle={(e, checked) => {
            MQTT.publish(this.switch_topic + '/set', checked ? 'on': 'off')
          }}
        />
        <div style={{flex: .9, marginTop: -22}}>
          <Slider 
            min={0}
            max={100}
            step={1}
            value={state.level}
            sliderStyle={{marginBottom: 0}}
            onChange={(e, value) => {
              this.setState({ level: value })
            }}
            onDragStop={(e, value) => {
              if (e.type === 'touchend') {
                MQTT.publish(this.level_topic + '/set', this.state.level)
              }
            }}
          />
        </div>
        <TextField
          id={this.thing.name.toLowerCase().replace(/ /g, '-')}
          style={{flex: .1, marginLeft: 50, marginTop: -14}}
          type="number"
          value={state.level}
          onChange={(e, value) => {
            if (value === '') {
              this.setState({ level: value })
              return
            }
            value = Number(value)
            if (value >= 0 && value <= 100) {
              this.setState({ level: value })
              MQTT.publish(this.level_topic + '/set', this.state.level)
            } 
          }}
        />
      </ListItem>
    )
  }

  handleMessage(topic, newState) {
    const what = topic.split('/').pop()
    this.setState({ [what]: newState })
  }

  componentDidMount() {
    MQTT.subscribe(this.switch_topic, this.handleMessage)
    MQTT.subscribe(this.level_topic, this.handleMessage)
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.switch_topic, this.handleMessage)
    MQTT.unsubscribe(this.level_topic, this.handleMessage)
  }
}

Dimmer.propTypes = {
  thing: PropTypes.object
}
