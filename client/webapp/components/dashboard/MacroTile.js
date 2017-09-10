import Config from '../../../Config'
import React from 'react'

import GlyphIcon from 'react-bootstrap/lib/Glyphicon'
import Tile from './Tile'
import MQTT from '../../../lib/MQTT'

export default class MacroTile extends React.Component {
  constructor(props) {
    super(props)
    this.config  = props.config
    this.label   = this.config.label
    this.name    = this.config.name
    this.topic   = `${Config.mqtt.macros}/run`
    this.onClick = this.onClick.bind(this)

    this.state = {backgroundColor: 'white'}
  }

  render() {
    return (
      <Tile
        //backgroundColor={this.state.backgroundColor}
        onClick={this.onClick}
      >
        <div style={{flexDirection: 'column'}}>
          <div style={{fontSize: 30, textAlign: 'center', marginBottom: 10}}>
            <GlyphIcon glyph="hand-right"/>
          </div>
          <div>{this.config.label}</div>
        </div>
      </Tile>
    )
  }

  onClick() {
    MQTT.publish(this.topic, this.name)
    this.setState({backgroundColor: 'cyan'})
    setTimeout(() => {
      this.setState({backgroundColor: undefined})
    }, 250)
  }
}
