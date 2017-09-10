import Config from '../../Config'

import React, {Component} from 'react'

import MQTT from '../../lib/MQTT'

// import TVGuideAPI from '../api/TVGuideAPI'

import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Button from 'react-bootstrap/lib/Button'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import Joystick from '../../common/Joystick'
import NumberPad from '../../common/NumberPad'
import RemoteButton from '../../common/MQTTButton'
import AudioControls from '../components/denon/AudioControls'

const SPACE = 10

export default class TiVo extends Component {
  constructor(props) {
    super()

    this.device = props.box.device
    this.denon  = props.box.denon
    this.state  = {showVolume: false}

    this.status_topic                = Config.mqtt.tivo + '/' + this.device + '/status/'
    this.status_topic_length         = this.status_topic.length
    this.set_topic                   = this.status_topic.replace('status', 'set')
    this.tvguide_status_topic        = Config.mqtt.tvguide + '/' + props.box.guide + '/status/'
    this.tvguide_status_topic_length = this.status_topic.length

    this.renderButton   = this.renderButton.bind(this)
    this.onStateChange  = this.onStateChange.bind(this)
    this.onGuideChange  = this.onGuideChange.bind(this)
    this.chooseFavorite = this.chooseFavorite.bind(this)
  }

  chooseFavorite(channel) {
    MQTT.publish(this.set_topic, channel.replace('favorites-', ''))
  }

  renderGlyph(glyph) {
    return <Glyphicon glyph={glyph}/>
  }

  rendeMiniButton(command, text, bsStyle) {
    const style = Config.ui.miniButtonStyle

    if (!text) {
      text = command
    }

    return (
      <RemoteButton
        topic={this.set_topic}
        value={command}
        bsStyle={bsStyle}
        buttonStyle={style}
      >
        {text}
      </RemoteButton>
    )
  }

  renderButton(command, text, bsStyle, buttonStyle) {
    if (!text) {
      text = command
    }

    return (
      <RemoteButton
        topic={this.set_topic}
        value={command}
        bsStyle={bsStyle}
        buttonStyle={buttonStyle}
      >
        {text}
      </RemoteButton>
    )
  }

  renderMiniButton(command, text, style) {
    return (
      <RemoteButton
        topic={this.set_topic}
        value={command}
        buttonStyle={Config.ui.miniButtonStyle}
        bsStyle={style}
      >
        {text}
      </RemoteButton>

    )
  }

  renderTivoLocation() {
    const device = this.device

    return (
      <div style={{marginTop: SPACE, textAlign: 'center'}}>
        <ButtonGroup>
          {this.renderButton('EXIT', 'Back')}
          {this.renderButton('LIVETV', 'Live TV')}
          {this.renderButton('TIVO', 'TiVo', 'primary')}
          {this.renderButton('GUIDE', 'Guide')}
          {this.renderButton('INFO', 'Info')}
        </ButtonGroup>
      </div>
    )
  }

  renderThumbsUpThumbsDown() {
    const device = this.device

    return (
      <div style={{marginTop: SPACE, textAlign: 'center'}}>
        <ButtonGroup>
          {this.renderButton('THUMBSDOWN', this.renderGlyph('thumbs-down'), 'danger')}
          {this.renderButton('THUMBSUP', this.renderGlyph('thumbs-up'), 'success')}
        </ButtonGroup>
      </div>
    )
  }

  renderJoystick() {
    return (
      <Joystick
        renderButton={this.renderButton}
        up="UP"
        down="DOWN"
        left="LEFT"
        right="RIGHT"
        pageUp="CHANNELUP"
        pageDown="CHANNELDOWN"
        select="SELECT"
      />
    )
  }

  renderABCD() {
    const device = this.device

    return (
      <div style={{marginTop: SPACE, textAlign: 'center'}}>
        <ButtonGroup>
          {this.renderButton('ACTION_A', 'A', 'warning')}
          {this.renderButton('ACTION_B', 'B', 'primary')}
          {this.renderButton('ACTION_C', 'C', 'danger')}
          {this.renderButton('ACTION_D', 'D', 'success')}
        </ButtonGroup>
      </div>
    )
  }

  renderNumberpad() {
    return (
      <NumberPad
        renderButton={this.renderButton}
        buttons={{
          '0':     {command: 'NUM0', display: '0',},
          '1':     {command: 'NUM1', display: '1',},
          '2':     {command: 'NUM2', display: '2',},
          '3':     {command: 'NUM3', display: '3',},
          '4':     {command: 'NUM4', display: '4',},
          '5':     {command: 'NUM5', display: '5',},
          '6':     {command: 'NUM6', display: '6',},
          '7':     {command: 'NUM7', display: '7',},
          '8':     {command: 'NUM8', display: '8',},
          '9':     {command: 'NUM9', display: '9',},
          'dot':   {command: 'CLEAR', display: 'Clear'},
          'enter': {command: 'ENTER', display: 'Enter'},
        }}
      />
    )
  }

  renderPlaybackControls() {
    const device = this.device,
          style  = Config.ui.miniButtonStyle

    return (
      <div style={{marginTop: SPACE, textAlign: 'center'}}>
        <ButtonGroup>
          {this.renderMiniButton('REPLAY', this.renderGlyph('fast-backward'))}
          {this.renderMiniButton('REVERSE', this.renderGlyph('backward'))}
          {this.renderMiniButton('PAUSE', this.renderGlyph('pause'))}
          {this.renderMiniButton('PLAY', this.renderGlyph('play'))}
          {this.renderMiniButton('SLOW', this.renderGlyph('step-forward'))}
          {this.renderMiniButton('FORWARD', this.renderGlyph('forward'))}
          {this.renderMiniButton('ADVANCE', this.renderGlyph('fast-forward'))}
          {this.renderMiniButton('RECORD', this.renderGlyph('record'), 'danger')}
        </ButtonGroup>
      </div>
    )
  }

  renderFavorites() {
    const small                     = Config.screenSize === 'small',
          device                    = this.device,
          {buttonStyle, buttonSize} = Config.ui,
          favorites                 = Config.tivoFavorites,
          guide                     = this.state.guide,
          dropdownId                = `${device}-favorites`

    return (
      <DropdownButton
        id={dropdownId}
        dropup={small}
        pullRight={!small}
        key={0}
        bsStyle="default"
        title="Favorites"
        bsSize={buttonSize}
      >
        {favorites.map((o, key) => {
          if (guide) {
            const info = guide[o.channel],
                  img  = info.logo ?
                    <img style={{width: 'auto', height: 24}} src={info.logo.URL}/> :
                    <img style={{width: 'auto', height: 24}} src="/img/transparent.gif"/>

            return (
              <MenuItem
                style={{width: 48, maxWidth: 48, minWidth: 0}}
                key={'favorites-' + o.channel}
                eventKey={'favorites-' + o.channel}
                onSelect={this.chooseFavorite}
              >
                {img} {info.callsign}
              </MenuItem>
            )
          }
          else {
            return (
              <MenuItem
                key={'favorites-' + o.channel}
                eventKey={'favorites-' + o.channel}
                onSelect={this.chooseFavorite}
              >
                {o.name}
              </MenuItem>
            )
          }
        })}
      </DropdownButton>
    )
  }

  renderHistory() {
    const small                         = Config.screenSize === 'small',
          history                       = this.state.history || [],
          guide                         = this.state.guide,
          {miniButtonStyle, buttonSize} = Config.ui

    let ndx = 0

    return (
      <span>
        {history.reverse().map((o, ndx) => {
          const key = this.device + '-history-' + o

          if (guide) {
            const info = guide[o],
                  img  = info ? (info.logo ?
                    <img style={{width: 'auto', height: small ? 20 : 24}} src={info.logo.URL}/> :
                    <img style={{width: 'auto', height: small ? 20 : 24}} src="/img/transparent.gif"/>) :
                    <div>{o}</div>

            return this.renderButton(o, img)
          }
          return (
            <Button key={key} style={miniButtonStyle}>{o}</Button>
          )
        })}
      </span>
    )
  }


  render() {
    if (Config.screenSize === 'small') {
      return (
        <div>
          {this.denon && <AudioControls
            device={this.denon}
                         />}
          {this.renderTivoLocation()}
          {this.renderThumbsUpThumbsDown()}
          {this.renderJoystick()}
          {this.renderABCD()}
          {this.renderNumberpad()}
          {this.renderPlaybackControls()}
          <div style={{marginTop: 10, marginBottom: 20, textAlign: 'center'}}>
            <ButtonGroup>
              {this.renderFavorites()}
              {this.renderHistory()}
            </ButtonGroup>
          </div>
        </div>
      )
    }
    return (
      <Row>
        <Col sm={2}>
          {this.denon && <AudioControls
            device={this.denon}
          />}
        </Col>
        <Col sm={8}>
          {this.renderTivoLocation()}
          {this.renderThumbsUpThumbsDown()}
          {this.renderJoystick()}
          {this.renderABCD()}
          {this.renderNumberpad()}
          {this.renderPlaybackControls()}
        </Col>
        <Col sm={2}>
          <div style={{marginTop: 60, textAlign: 'center'}}>
            {this.renderFavorites()}
          </div>
          <h5>History</h5>
          <ButtonGroup vertical justified>
            {this.renderHistory()}
          </ButtonGroup>
        </Col>
      </Row>
    )
  }

  onStateChange(topic, message) {
    const key        = topic.substr(this.status_topic_length),
          newState   = {},
          state      = this.state || {},
          history    = this.state.history || [],
          maxHistory = window.innerHeight > 500 ? 4 : 2

    if (key === 'channel') {
      if (state.channel && message !== state.channel) {
        if (history.indexOf(message) === -1) {
          if (history.length > maxHistory) {
            history.pop()
          }
          history.unshift(message)
          newState.history = history
        }
        // uncomment this to clear history
        // newValue.history = []
      }
    }

    newState[key] = message
    this.setState(newState)
  }

  onGuideChange(topic, message) {
    this.setState({guide: message})
  }

  componentDidMount() {
    MQTT.subscribe(this.status_topic + 'mode', this.onStateChange)
    MQTT.subscribe(this.status_topic + 'channel', this.onStateChange)
    MQTT.subscribe(this.tvguide_status_topic + 'channels', this.onGuideChange)
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.status_topic + 'mode', this.onStateChange)
    MQTT.unsubscribe(this.status_topic + 'channel', this.onStateChange)
    MQTT.unsubscribe(this.tvguide_status_topic + 'channels', this.onGuideChange)
  }
}
