import Config from '../../../Config'

import React from 'react'
import Tile from './Tile'

import MQTT from '../../../lib/MQTT'

import Glyphicon from 'react-bootstrap/lib/Glyphicon'

export default class WeatherTile extends React.Component {
  constructor(props) {
    super(props)

    this.location  = Config.weather.locations[0]

    this.status_topic = Config.mqtt.weather + '/' + this.location.device + '/status/'
    this.status_topic_length = this.status_topic.length

    this.onStateChange = this.onStateChange.bind(this)
  }

  render() {
    if (!this.state) {
      return null
    }

    const now = this.state.now
    if (!now) {
      return null
    }

    try {

      //if (Config.screenSize === 'small') {
      //  return (
      //    <Tile
      //      onClick="weather"
      //    >
      //      <div style={{fontSize: 48}}>
      //        <img style={styles.img}
      //          src={`/img/Weather/icons/black/${now.icon}.svg`}
      //        />
      //        <div style={{display: 'inline'}}>{now.current_temperature}&deg;F</div>
      //      </div>
      //    </Tile>
      //  )
      //}
      const tileSize = Config.screenSize === 'small' ? 1 : 2
      return (
        <Tile
          //backgroundColor="white"
          //color="blac,cick"
          width={tileSize}
          height={tileSize}
          onClick="weather"
        >
          <div style={{textAlign: 'center'}}>
            <div>{this.state.display_city}</div>
            <div style={{fontSize: 24*tileSize, paddingRight: 10, marginBottom: 10}}>
              <img 
                style={{
                  verticalAlign: 'middle',
                  width:         48 * tileSize,
                  height:        48 * tileSize
                }} 
                src={'/img/Weather/icons/black/' + now.icon + '.svg'}
              />
              <div style={{display: 'inline', paddingTop: 10}}>{now.current_temperature}&deg;F</div>
            </div>
            <div style={{fontSize: 12 * tileSize, marginTop: 5, marginBottom: 10, textAlign: 'center'}}>
              <Glyphicon style={{fontSize: 16 * tileSize}} glyph="flag"/> {now.wind_direction} {now.current_wind} MPH
            </div>
          </div>
        </Tile>
      )
    }
    catch (e) {
      return null
    }
  }

  onStateChange(topic, newState) {
    const newVal = {}

    newVal[topic.substr(this.status_topic_length)] = newState
    this.setState(newVal)
  }
  componentDidMount() {
    MQTT.subscribe(this.status_topic + 'now', this.onStateChange)
    MQTT.subscribe(this.status_topic + 'display_city', this.onStateChange)
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.status_topic + 'now', this.onStateChange)
    MQTT.unsubscribe(this.status_topic + 'display_city', this.onStateChange)
  }
}
