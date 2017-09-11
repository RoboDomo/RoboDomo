import Config from '../../../Config'

import React from 'react'
import Tile from './Tile'
import MQTT from '../../../lib/MQTT'

const topics = [
  'pump',
  'cleaner',
  'poolTemp'
]

export default class PoolTile extends React.Component {
  constructor(props) {
    super(props)

    this.controller          = Config.autelis.controllers[0]
    this.deviceMap           = this.controller.deviceMap
    this.status_topic        = Config.mqtt.autelis + '/status/'
    this.status_topic_length = this.status_topic.length
    this.onStateChange       = this.onStateChange.bind(this)
  }

  render() {
    try {
      if (!this.state) {
        return null
      }

      const tileSize = Config.screenSize === 'small' ? 1 : 2,
            state = this.state

      function renderControl(ndx, text, big) {
        if (!state[ndx] || state[ndx].toLowerCase() !== 'on') {
          return null
        }
        if (big) {
          return (
            <div style={{fontSize: 30}}>
              {text}
            </div>
          )
        }

        return (
          <div>
            {text}
          </div>
        )
      }

      const on              = state.pump.toLowerCase() === 'on',
            backgroundColor = on ? 'green' : undefined,
            color           = on ? 'white' : undefined

      function renderPool() {
        if (on) {
          return (
            <div>
              {renderControl('pump', `Pool ${state.poolTemp}°F`, true)}
              {renderControl('pump', 'Filter On')}
              {renderControl('cleaner', 'Cleaner On')}
              {renderControl('waterfall', 'Waterfall On')}
            </div>
          )
        }
        else {
          return (
            <div>
              <div style={{fontSize: 30*tileSize}}>
                {'Pool Off'}
              </div>
            </div>
          )
        }
      }

      return (
        <Tile
          backgroundColor={backgroundColor}
          color={color}
          width={tileSize}
          height={1}
          onClick="poolcontrol"
        >
          <div style={{textAlign: 'center'}}>
            {renderPool()}
          </div>
        </Tile>
      )
    }
    catch (e) {
      return null
    }
  }

  onStateChange(topic, newState) {
    const newValue = {},
          what     = topic.substr(this.status_topic_length),
          key      = this.deviceMap.backward[what] || what


    newValue[key] = newState
    this.setState(newValue)
  }

  componentDidMount() {
    const status_topic = this.status_topic,
          deviceMap    = this.deviceMap.forward

    topics.forEach((topic) => {
      const device = deviceMap[topic] || topic
      MQTT.subscribe(status_topic + device, this.onStateChange)
    })
  }

  componentWillUnmount() {
    const status_topic = Config.mqtt.autelis + '/status/',
          deviceMap    = this.deviceMap.forward

    topics.forEach((topic) => {
      const device = deviceMap[topic] || topic
      MQTT.unsubscribe(status_topic + device, this.onStateChange)
    })
  }
}
