import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Config from '../Config'

import ListItem from 'material-ui/List'
import Toggle from 'material-ui/Toggle'
//import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField'

import MQTT from '../lib/MQTT'

export default class Motion extends Component {
  state = {
    motion: ''
  }

  constructor({thing}) {
    super()
    this.thing = thing
    this.motion_topic = [Config.mqtt.smartthings, this.thing.name, 'motion'].join('/')
    this.handleMessage = ::this.handleMessage // this.handleMessage.bind(this)
  }

  render() {
    const state = this.state

    return (
      <ListItem style={{display: 'flex'}}>
        <label 
          style={{
            width:      220, 
            //marginRight: 50, 
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {this.thing.name}
        </label>
        <TextField
          fullWidth
          id={this.thing.name.toLowerCase().replace(/ /g, '-')}
          style={{flex: 1, marginLeft: 50, marginTop: -14}}
          value={state.motion}
          disabled
        />
      </ListItem>
    )
  }

  handleMessage(topic, newState) {
    const what = topic.split('/').pop()
    this.setState({ [what]: newState })
  }

  componentDidMount() {
    MQTT.subscribe(this.motion_topic, this.handleMessage)
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.motion_topic, this.handleMessage)
  }
}

