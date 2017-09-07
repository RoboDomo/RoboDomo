
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Config from '../Config'

import ListItem from 'material-ui/List'
import RaisedButton from 'material-ui/RaisedButton'

import MQTT from '../lib/MQTT'

const levelString = (level) => {
  if (level > 67) {
    return 'high'
  }
  else if (level > 33) {
    return 'medium'
  }
  else if (level > 0) {
    return 'low'
  }
  else {
    return 'off'
  }
}

class FanButton extends Component {
  render() {
    const label = this.props.label
    return (
      <RaisedButton
        label={label}
        onClick={this.props.onToggle}
      />
    )
  }
}

export default class Fan extends Component {
  state = {
    switch: 'off',
    level:  'low'
  }

  constructor({thing}) {
    super()

    this.thing = thing
    this.switch_topic = [Config.mqtt.smartthings, this.thing.name, 'switch'].join('/')
    this.level_topic = this.switch_topic.replace('switch', 'level')

    this.handleMessage = ::this.handleMessage
    this.handleToggle = ::this.handleToggle
  }

  render() {
    const state = this.state,
          sw = state.switch,
          level = state.level

    if (Config.screenSize === 'small') {
      return (
        <ListItem style={{display: 'flex'}}>
          <div style={{width: 220, marginRight: 50}}>
            {this.thing.name}
          </div>
          <div style={{flex: 1}}>
            <FanButton
              label={sw === 'on' ? level : 'off'}
              onToggle={this.handleToggle}
            />
          </div>
        </ListItem>
      )
    }
    return (
      <ListItem style={{display: 'flex'}}>
        <div style={{width: 220, marginRight: 50}}>
          {this.thing.name}
        </div>
        <div style={{flex: 1}}>
          <RaisedButton
            label="OFF"
            primary={sw === 'off'}
            onClick={() => this.setLevel(0)}
          />
          <RaisedButton
            label="LOW"
            primary={sw !== 'off' && level === 'low'}
            onClick={() => this.setLevel(25)}
          />
          <RaisedButton
            label="MEDIUM"
            primary={sw !== 'off' && level === 'medium'}
            onClick={() => this.setLevel(50)}
          />
          <RaisedButton
            label="HIGH"
            primary={sw !== 'off' && level === 'high'}
            onClick={() => this.setLevel(75)}
          />
        </div>
      </ListItem>
    )
  }

  setLevel(level) {
    let newLevel = 0

    if (level > 67) {
      newLevel = 75
    }
    else if (level > 33) {
      newLevel = 50
    }
    else if (level > 0) {
      newLevel = 25
    }
    console.log('setLevel', level, newLevel)
    if (newLevel > 0) {
      this.setState({ 
        switch: 'on',
        level:  levelString(newLevel)
      })
      MQTT.publish(this.switch_topic + '/set', 'on')
      MQTT.publish(this.level_topic + '/set', newLevel)
    }
    else {
      this.setState({ 
        switch: 'off',
        level:  'off'
      })
      MQTT.publish(this.switch_topic + '/set', 'off')
    }
  }

  // Toggle the FanButton
  handleToggle() {
    const level = this.state.switch  === 'on' ? this.state.level : 'off'
    switch(level) {
      case 'off':
        this.setLevel(25)
        break
      case 'low':
        this.setLevel(50)
        break
      case 'medium':
        this.setLevel(75)
        break
      case 'high':
        this.setLevel(0)
        break
    }
  }
  
  handleMessage(topic, newState) {
    console.log('handleMessage', topic, newState, arguments)
    const what = topic.split('/').pop()
    if (what === 'level') {
      newState = levelString(newState)
    }
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

Fan.propTypes = {
  thing: PropTypes.object
}
