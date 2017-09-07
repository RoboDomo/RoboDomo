import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Config from '../Config'

import ListItem from 'material-ui/List'
import Toggle from 'material-ui/Toggle'
import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField'

import MQTT from '../lib/MQTT'

export default class Switch extends Component {
  state = {
    switch: 'off'
  }

  constructor({thing}) {
    super()
    this.thing = thing
    this.switch_topic = [Config.mqtt.smartthings, this.thing.name, 'switch'].join('/')
    this.handleMessage = ::this.handleMessage // this.handleMessage.bind(this)
  }

  render() {
    const state = this.state

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
      </ListItem>
    )
  }

  handleMessage(topic, newState) {
    const what = topic.split('/').pop()
    this.setState({ [what]: newState })
  }

  componentDidMount() {
    MQTT.subscribe(this.switch_topic, this.handleMessage)
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.switch_topic, this.handleMessage)
  }
}
