import Config from '../../Config'
import React, {Component} from 'react'

import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Thumbnail from 'react-bootstrap/lib/Thumbnail'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import JumboTron from 'react-bootstrap/lib/Jumbotron'

import RemoteButton from '../../common/MQTTButton'
import AudioControls from '../components/denon/AudioControls'

import MQTT from '../../lib/MQTT'

const SPACE = 10

const topics = [
  'foregroundApp',
  'launchPoints',
  'power',
]

export default class LGTV extends Component {
  constructor(props) {
    super()

    this.device              = props.tv.device
    this.favorites           = props.tv.favorites
    this.denon               = props.tv.denon
    this.state               = null
    this.status_topic        = Config.mqtt.lgtv + '/' + this.device + '/status/'
    this.status_topic_length = this.status_topic.length
    this.set_topic           = this.status_topic.replace('status', 'set') + 'command'
    this.onStateChange       = this.onStateChange.bind(this)
  }


  renderButton(command, text, bsStyle) {
    return (
      <RemoteButton
        topic={this.set_topic}
        value={command}
        bsStype={bsStyle}
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

  renderJoystick() {
    const buttonStyle = Config.ui.buttonStyle

    return (
      <div style={{marginTop: SPACE, textAlign: 'center'}}>
        <div style={{width: (buttonStyle.width * 2), marginLeft: 'auto', marginRight: 'auto'}}>
          <ButtonGroup style={{marginLeft: 0}}>
            {this.renderButton('KEY_UP', <Glyphicon glyph="chevron-up"/>)}
          </ButtonGroup>
        </div>
        <div>
          <ButtonGroup>
            {this.renderButton('KEY_LEFT', <Glyphicon glyph="chevron-left"/>)}
            {this.renderButton('KEY_ENTER', 'Select', 'primary')}
            {this.renderButton('KEY_RIGHT', <Glyphicon glyph="chevron-right"/>)}
          </ButtonGroup>
        </div>
        <div style={{width: (buttonStyle.width * 2), marginLeft: 'auto', marginRight: 'auto'}}>
          <ButtonGroup style={{marginLeft: 0}}>
            {this.renderButton('KEY_DOWN', <Glyphicon glyph="chevron-down"/>)}
          </ButtonGroup>
        </div>
      </div>
    )
  }

  renderPlaybackControls() {
    return (
      <div style={{marginTop: SPACE, textAlign: 'center'}}>
        <ButtonGroup>
          {this.renderMiniButton('KEY_BACK', <Glyphicon glyph="fast-backward"/>)}
          {this.renderMiniButton('REWIND', <Glyphicon glyph="backward"/>)}
          {this.renderMiniButton('PAUSE', <Glyphicon glyph="pause"/>)}
          {this.renderMiniButton('PLAY', <Glyphicon glyph="play"/>)}
          {this.renderMiniButton('FASTFORWARD', <Glyphicon glyph="forward"/>)}
        </ButtonGroup>
        <ButtonGroup style={{marginLeft: 10}}>
          {this.renderMiniButton('STOP', <Glyphicon glyph="stop"/>)}
        </ButtonGroup>
      </div>
    )
  }

  renderNowPlaying() {
    const appId = this.state.foregroundApp.appId,
          app   = this.state.launchPoints[appId]

    if (!app) {
      return null
    }
    return (
      <div style={{textAlign: 'center'}}>
        <div style={{marginLeft: 'auto', marginRight: 'auto', width: 150}}>
          <Thumbnail src={app.largeIcon}>
            {app.title}
          </Thumbnail>
        </div>
      </div>
    )
  }

  renderFavorites() {
    const small       = Config.screenSize === 'small',
          lp          = this.state.launchPoints,
          buttonStyle = small ? {
            width:  60, height: 60
          } : {
            width:  80, height: 80
          },
          imgHeight   = small ? 20 : 40,
          fontSize    = small ? 7 : 10,
          favorites   = []

    this.favorites.forEach((fav) => {
      Object.keys(lp).forEach((key) => {
        if (key.indexOf(fav) !== -1) {
          favorites.push({id: lp[key].id, icon: lp[key].icon, title: lp[key].title})
        }
      })
    })
    return (
      <div style={{marginTop: SPACE, textAlign: 'center'}}>
        <div>
          {favorites.map((fav) => {
            if (fav.id.indexOf('hdmi') === -1) {
              const command = 'LAUNCH-' + fav.id
              return (
                <RemoteButton
                  key={fav.id}
                  buttonStyle={buttonStyle}
                  topic={this.set_topic}
                  value={command}
                >
                  <img style={{width: 'auto', height: imgHeight}} src={fav.icon}/>
                  <div style={{fontSize: fontSize}}>
                    {fav.title.replace('Prime Video', '')}
                  </div>
                </RemoteButton>
              )
            }
            else {
              return null
            }
          })}
        </div>
        <div style={{marginTop: 4}}>
          {favorites.map((fav) => {
            if (fav.id.indexOf('hdmi') !== -1) {
              const command = 'LAUNCH-' + fav.id
              return (
                <RemoteButton
                  key={fav.id}
                  buttonStyle={buttonStyle}
                  topic={this.set_topic}
                  value={command}
                >
                  <img style={{width: 'auto', height: imgHeight}} src={fav.icon}/>
                  <div style={{fontSize: fontSize}}>
                    {fav.title}
                  </div>
                </RemoteButton>
              )
            }
            else {
              return null
            }
          })}
        </div>
      </div>
    )
  }

  renderOff() {
    return (
      <JumboTron>
        <h1>TV is OFF</h1>
        <p>The TV is off. Press the button below to turn it on via Wake On Lan</p>
        <RemoteButton
          bsStyle="primary"
          topic={this.set_topic}
          value="POWERON"
          buttonStyle={{width: '100%'}}
        >
          <Glyphicon glyph="off"/>
        </RemoteButton>
      </JumboTron>
    )
  }

  renderSmall() {
    return (
      <div>
        {
          this.denon && <AudioControls
            device={this.denon}
          />
        }
        {/*{this.renderNowPlaying()}*/}
        {this.renderJoystick()}
        {this.renderPlaybackControls()}
        {this.renderFavorites()}
        <RemoteButton
          bsStyle="danger"
          buttonStyle={{marginTop: 20, marginBottom: 30, width: '100%'}}
          topic={this.set_topic}
          value="POWEROFF"
        >
          <Glyphicon glyph="off"/>
        </RemoteButton>
      </div>
    )
  }

  render() {
    // TODO: handle case where TV is turned off - logos aren't available for favorites, for example
    if (!this.state || !this.state.foregroundApp || !this.state.launchPoints || this.state.power === 'off') {
      return this.renderOff()
    }
    if (Config.screenSize === 'small') {
      return this.renderSmall()
    }
    return (
      <Row>
        <Col sm={2}>
          {
            this.denon && <AudioControls
              device={this.denon}
            />
          }
        </Col>
        <Col sm={8}>
          {this.renderNowPlaying()}
          {this.renderJoystick()}
          {this.renderPlaybackControls()}
          {this.renderFavorites()}
        </Col>
        <Col sm={2} style={{marginTop: 30}}>
          <RemoteButton
            bsStyle="danger"
            topic={this.set_topic}
            value="POWEROFF"
          >
            {'Power Off'}
          </RemoteButton>
        </Col>
      </Row>
    )
  }

  onStateChange(topic, newState) {
    const newValue = {},
          key      = topic.substr(this.status_topic_length)

    newValue[key] = newState
    this.setState(newValue)
  }

  componentDidMount() {
    const status_topic = this.status_topic

    topics.forEach((topic) => {
      MQTT.subscribe(status_topic + topic, this.onStateChange)
    })
  }

  componentWillUnmount() {
    const status_topic = this.status_topic

    topics.forEach((topic) => {
      MQTT.unsubscribe(status_topic + topic, this.onStateChange)
    })
  }
}
