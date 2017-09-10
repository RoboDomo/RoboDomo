import Config from '../../../Config'

import MQTT from '../../../lib/MQTT'

import React, {Component} from 'react'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import DenonButton from '../../../common/MQTTButton'

export default class AudioControl extends Component {
  constructor(props) {
    super(props)

    this.device              = props.device
    this.state               = {showVolume: false}
    this.status_topic        = Config.mqtt.denon + '/' + this.device + '/status/'
    this.status_topic_length = this.status_topic.length
    this.set_topic           = this.status_topic.replace('status', 'set') + 'command'

    this.onStateChange = this.onStateChange.bind(this)
  }

  renderGlyphButton(command, glyph, bsStyle) {
    return (
      <DenonButton
        bsStyle={bsStyle}
        topic={this.set_topic}
        value={command}
      >
        <Glyphicon glyph={glyph}/>
      </DenonButton>
    )
  }

  renderTextButton(command, text, bsStyle) {
    return (
      <DenonButton
        bsStyle={bsStyle}
        topic={this.set_topic}
        value={command}
      >
        {text}
      </DenonButton>
    )
  }

  render() {
    const on = this.state.mute === 'ON'
    const device = this.device

    if (!device) {
      return null
    }

    if (Config.screenSize === 'small') {

      return (
        <div style={{marginTop: 10, textAlign: 'center'}}>
          <div
            onClick={() => this.setState({showVolume: !this.state.showVolume})}
          >
                        Volume Controls
            <Glyphicon style={{marginLeft: 4}}
              glyph={this.state.showVolume ? 'chevron-up' : 'chevron-down'}
            />
          </div>
          <div
            style={{
              display: this.state.showVolume ? 'block' : 'none'
            }}
          >
            <h5 style={{whiteSpace: 'nowrap'}}>Master Volume</h5>
            <ButtonGroup>
              {this.renderGlyphButton(
                on ? 'MUOFF' : 'MUON',
                'volume-off',
                on ? 'danger' : 'default')}
              {this.renderGlyphButton('MVUP', 'volume-up')}
              {this.renderGlyphButton('MVDOWN', 'volume-down')}
            </ButtonGroup>
            <h5 style={{whiteSpace: 'nowrap'}}>Center Channel</h5>
            <ButtonGroup>
              {this.renderGlyphButton('CVC UP', 'volume-up')}
              {this.renderGlyphButton('CVC DOWN', 'volume-down')}
            </ButtonGroup>
            <h5 style={{whiteSpace: 'nowrap'}}>Surround Mode</h5>
            <ButtonGroup>
              {this.renderTextButton('MSAUTO', 'Auto')}
              {this.renderTextButton('MSMOVIE', 'Movie')}
              {this.renderTextButton('MSMUSIC', 'Music')}
            </ButtonGroup>
          </div>
        </div>
      )

    }

    return (
      <div style={{marginTop: 60}}>
        <h5 style={{whiteSpace: 'nowrap'}}>Master Volume</h5>
        <ButtonGroup vertical>
          {this.renderGlyphButton(
            on ? 'MUOFF' : 'MUON',
            'volume-off',
            on ? 'danger' : 'default')}
          {this.renderGlyphButton('MVUP', 'volume-up')}
          {this.renderGlyphButton('MVDOWN', 'volume-down')}
        </ButtonGroup>
        <h5 style={{whiteSpace: 'nowrap'}}>Center Channel</h5>
        <ButtonGroup vertical>
          {this.renderGlyphButton('CVC UP', 'volume-up')}
          {this.renderGlyphButton('CVC DOWN', 'volume-down')}
        </ButtonGroup>
        <h5 style={{whiteSpace: 'nowrap'}}>Surround Mode</h5>
        <ButtonGroup vertical>
          {this.renderTextButton('MSAUTO', 'Auto')}
          {this.renderTextButton('MSMOVIE', 'Movie')}
          {this.renderTextButton('MSMUSIC', 'Music')}
        </ButtonGroup>
      </div>
    )
  }

  onStateChange(topic, newState) {
    this.setState({mute: newState})
  }

  componentDidMount() {
    MQTT.subscribe(this.status_topic + 'MU', this.onStateChange)
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.status_topic + 'MU', this.onStateChange)
  }
}
