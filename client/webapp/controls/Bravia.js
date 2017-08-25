import Config from '../../Config'

import React from 'react'

import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import JumboTron from 'react-bootstrap/lib/Jumbotron'
import Button from 'react-bootstrap/lib/Button'

import MQTT from '../../lib/MQTT'
import RemoteButton from '../../common/MQTTButton'

import Joystick from '../../common/Joystick'
import NumberPad from '../../common/NumberPad'

const SPACE = 10

const topics = [
    'volume',
    'appsMap',
    'power',
]

export default class Bravia extends React.Component {
    constructor(props) {
        super(props)

        this.device              = props.tv.device
        this.name                = props.tv.name
        this.favorites           = props.tv.favorites
        this.state               = null
        this.favoritesTop        = 0
        this.status_topic        = Config.mqtt.bravia + '/' + this.device + '/status/'
        this.status_topic_length = this.status_topic.length
        this.set_topic           = this.status_topic.replace('status', 'set') + 'command'
        this.onStateChange       = this.onStateChange.bind(this)
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

    renderAudioControls() {
        const device = this.device,
              muted  = this.state.volume ? this.state.volume.speaker.mute : false

        if (Config.screenSize === 'small') {
            return (
                <div style={{marginTop: 10, textAlign: 'center'}}>
                    <ButtonGroup>
                        {this.renderButton('Mute', 'Mute', (muted ? 'danger' : 'default'))}
                        {this.renderButton('VolumeDown', <Glyphicon glyph="volume-down"/>)}
                        {this.renderButton('VolumeUp', <Glyphicon glyph="volume-up"/>)}
                    </ButtonGroup>
                </div>
            )
        }

        return (
            <div style={{marginTop: 30}}>
                <h5 style={{whiteSpace: 'nowrap'}}>TV Volume</h5>
                <ButtonGroup vertical>
                    {this.renderButton('Mute', 'Mute', (muted ? 'danger' : 'default'))}
                    {this.renderButton('VolumeDown', <Glyphicon glyph="volume-down"/>)}
                    {this.renderButton('VolumeUp', <Glyphicon glyph="volume-up"/>)}
                </ButtonGroup>
            </div>
        )
    }

    renderPlaybackControls() {
        return (
            <div style={{marginTop: SPACE, textAlign: 'center'}}>
                <ButtonGroup>
                    {this.renderMiniButton('Rewind', <Glyphicon glyph="backward"/>)}
                    {this.renderMiniButton('Pause', <Glyphicon glyph="pause"/>)}
                    {this.renderMiniButton('Play', <Glyphicon glyph="play"/>)}
                    {this.renderMiniButton('Forward', <Glyphicon glyph="forward"/>)}
                </ButtonGroup>
                <ButtonGroup style={{marginLeft: 10}}>
                    {this.renderMiniButton('Stop', <Glyphicon glyph="stop"/>)}
                </ButtonGroup>
            </div>
        )
    }

    renderControls() {
        return (
            <div style={{marginTop: SPACE, textAlign: 'center'}}>
                <ButtonGroup>
                    {this.renderButton('Return')}
                    {this.renderButton('Display')}
                    {this.renderButton('Home', 'Home', 'primary')}
                    {this.renderButton('Netflix')}
                    {this.renderButton('ActionMehu', 'Menu')}
                </ButtonGroup>
            </div>
        )
    }

    renderInputs() {
        const device = this.device

        return (
            <div style={{marginTop: SPACE, textAlign: 'center'}}>
                <ButtonGroup>
                    {this.renderButton('Hdmi1', 'HDMI 1')}
                    {this.renderButton('Hdmi2', 'HDMI 2')}
                    {this.renderButton('Hdmi3', 'HDMI 3')}
                    {this.renderButton('Hdmi4', 'HDMI 4')}
                </ButtonGroup>
            </div>
        )
    }

    renderOff() {
        return (
            <JumboTron style={{padding: 10}}>
                <h1>TV is OFF</h1>
                <p>The TV is off. Press the button below to turn it on.</p>
                <RemoteButton
                    buttonStyle={{width: '100%', width: 'auto', height: 'auto'}}
                    bsStyle="primary"
                    bsSize="large"
                    topic={this.set_topic}
                    value="WakeUp"
                >
                    Power ON
                </RemoteButton>
            </JumboTron>
        )
    }

    renderABCD() {
        const device = this.device

        return (
            <div style={{marginTop: SPACE, textAlign: 'center'}}>
                <ButtonGroup>
                    {this.renderButton('Yellow', 'A', 'warning')}
                    {this.renderButton('Blue', 'B', 'primary')}
                    {this.renderButton('Red', 'C', 'danger')}
                    {this.renderButton('Green', 'D', 'success')}
                </ButtonGroup>
            </div>
        )
    }

    renderNumberpad() {
        return (
            <div style={{marginTop: SPACE, textAlign: 'center'}}>
                <NumberPad
                    renderButton={this.renderButton}
                    buttons={{
                        '0':     {command: 'Num0', display: '0',},
                        '1':     {command: 'Num1', display: '1',},
                        '2':     {command: 'Num2', display: '2',},
                        '3':     {command: 'Num3', display: '3',},
                        '4':     {command: 'Num4', display: '4',},
                        '5':     {command: 'Num5', display: '5',},
                        '6':     {command: 'Num6', display: '6',},
                        '7':     {command: 'Num7', display: '7',},
                        '8':     {command: 'Num8', display: '8',},
                        '9':     {command: 'Num9', display: '9',},
                        'dot':   {command: 'DOT', display: 'Clear'},
                        'enter': {command: 'Enter', display: 'Enter'},
                    }}
                />
            </div>
        )

    }

    renderFavorites() {
        const small     = Config.screenSize === 'small',
              size      = small ? 150 : 80,
              imgSize   = small ? 100 : 40,
              fontSize  = small ? 14 : 8,
              device    = this.device,
              lp        = this.state.appsMap,
              favorites = [],
              el        = this.favoritesEl,
              top       = el ? el.scrollTop : 0,
              height    = 3 * size,
              maxTop    = (this.favorites.length - 5) * size,
              delta     = size / 20

        this.favorites.forEach((fav) => {
            Object.keys(lp).forEach((key) => {
                if (key.toLowerCase().indexOf(fav) !== -1) {
                    favorites.push(lp[key])
                }
            })
        })

        return (
            <div
                style={{
                    marginTop:   SPACE * 2,
                    textAlign:   'center',
                    width:       size,
                    marginLeft:  'auto',
                    marginRight: 'auto'
                }}
            >
                <Button
                    style={{
                        width:  size,
                        height: 40
                    }}
                    disabled={!top}
                    onClick={
                        function () {
                            if (this.favoritesBusy) {
                                return
                            }
                            this.favoritesBusy = true
                            const el           = this.favoritesEl,
                                  newTop       = el.scrollTop - size,
                                  timer        = setInterval(() => {
                                      el.scrollTop -= delta
                                      if (el.scrollTop <= newTop) {
                                          clearInterval(timer)
                                          el.scrollTop       = newTop
                                          this.favoritesBusy = false
                                          this.setState({favoritesTop: el.scrollTop})
                                          return
                                      }
                                  }, 10)
                        }.bind(this)
                    }

                >
                    <Glyphicon glyph="chevron-up"/>
                </Button>
                <div
                    ref={(el) => {
                        this.favoritesEl = el
                    }}
                    style={{
                        height:   size * 3,
                        overflow: 'hidden',
                    }}
                >
                    {favorites.map((fav) => {
                        const command = 'LAUNCH-' + fav.uri
                        return (
                            <RemoteButton
                                key={fav.title.replace(/ /g, '-')}
                                buttonStyle={{
                                    width:  size,
                                    height: size
                                }}
                                topic={this.set_topic}
                                value={command}
                            >
                                <img style={{width: 'auto', height: imgSize}} src={fav.icon}/>
                                <div style={{fontSize: fontSize}}>{fav.title.replace('Prime Video', '')}</div>
                            </RemoteButton>
                        )
                    })}
                </div>
                <Button
                    style={{
                        width:  size,
                        height: 40
                    }}
                    disabled={top >= maxTop}
                    onClick={function () {
                        if (this.favoritesBusy) {
                            return false
                        }
                        const el     = this.favoritesEl,
                              newTop = Math.min(el.scrollTop + size, maxTop)

                        this.favoritesBusy = true
                        const timer        = setInterval(() => {
                            if (el.scrollTop >= newTop) {
                                clearInterval(timer)
                                el.scrollTop       = newTop
                                this.favoritesBusy = false
                                this.setState({favoritesTop: el.scrollTop})
                                return
                            }
                            el.scrollTop += delta
                        }, 10)
                    }.bind(this)}
                >
                    <Glyphicon glyph="chevron-down"/>
                </Button>
            </div>
        )
    }


    render() {
        // TODO: handle case where TV is turned off - logos aren't available for favorites, for example
        if (!this.state || !this.state.power) {
            return this.renderOff()
        }

        if (Config.screenSize === 'small') {
            return (
                <div>
                    {this.renderAudioControls()}
                    {this.renderControls()}
                    <Joystick
                        device={this.device}
                        renderButton={this.renderButton}
                        renderMiniButton={this.renderMiniButton}
                        up="Up"
                        down="Down"
                        left="Left"
                        right="Right"
                        select="DpadCenter"
                    />
                    {this.renderPlaybackControls()}
                    {this.renderABCD()}
                    {this.renderNumberpad()}
                    {this.renderInputs()}
                    {this.renderFavorites()}
                    {this.renderButton('PowerOff', 'Power Off', 'danger', {width: '100%', marginTop: 20, marginBottom: 20} )}
                </div>
            )
        }
        return (
            <Row>
                <Col sm={2}>
                    {this.renderAudioControls()}
                </Col>
                <Col sm={8}>
                    {this.renderControls()}
                    <Joystick
                        device={this.device}
                        renderButton={this.renderButton}
                        renderMiniButton={this.renderMiniButton}
                        up="Up"
                        down="Down"
                        left="Left"
                        right="Right"
                        select="DpadCenter"
                    />
                    {this.renderPlaybackControls()}
                    {this.renderABCD()}
                    {this.renderNumberpad()}
                    {this.renderInputs()}
                </Col>
                <Col sm={2} style={{marginTop: 30}}>
                    {this.renderButton('PowerOff', 'Power Off')}
                    {this.renderFavorites()}
                </Col>
            </Row>
        )
    }

    onStateChange(topic, newState) {
        const newValue = {},
              key     = topic.substr(this.status_topic_length)

        newValue[key] = newState
        console.log('statechange', newValue)
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
