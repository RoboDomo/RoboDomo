import Config from '../../../Config'

import React from 'react'

import Image from 'react-bootstrap/lib/Image'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import Tile from './Tile'

import DenonButton from '../../../common/MQTTButton'

import MQTT from '../../../lib/MQTT'

// TODO: support Bravia, various combinations of TVs, receivers, etc.
export default class TheaterTile extends React.Component {
    constructor(props) {
        super(props)
        const config = props.config

        this.tv                = config.tv
        this.tv_status_topic   = `${Config.mqtt.lgtv}/${this.tv}/status/`
        this.tivo              = config.tivo
        this.tivo_status_topic = `${Config.mqtt.tivo}/${this.tivo}/status/`
        // find tivo in Config and get the guide id
        this.guide             = null
        Config.tivo.boxes.forEach((box) => {
            if (box.device === this.tivo) {
                if (this.guide) {
                    return
                }
                this.guide              = box.guide
                this.guide_status_topic = `${Config.mqtt.tvguide}/${this.guide}/status/`
            }
        })

        this.denon = config.denon || null
        if (this.denon) {
            this.denon_status_topic = `${Config.mqtt.denon}/${this.denon}/status/`
        }

        this.tvStateChange      = this.tvStateChange.bind(this)
        this.tivoStateChange    = this.tivoStateChange.bind(this)
        this.tvguideStateChange = this.tvguideStateChange.bind(this)
        this.denonStateChange   = this.denonStateChange.bind(this)
    }

    renderOff() {
        return (
            <Tile
                onClick="harmony"
                width="2"
                height="2"
            >
                <h1>TV is off</h1>
            </Tile>
        )
    }

    render() {
        const state = this.state

        if (!state || !state.tivo || !state.tv || !state.tvguide || !state.denon) {
            return null
        }

        if (!state.tv.foregroundApp) {
            return this.renderOff()
        }
        try {
            const tivo        = state.tivo,
                  channel     = tivo.channel,
                  tv          = state.tv,
                  tvguide     = state.tvguide,
                  info        = tvguide.channels[channel],
                  appId       = tv.foregroundApp.appId,
                  app         = tv.launchPoints[appId],
                  denon       = this.denon,
                  buttonStyle = Config.ui.miniButtonStyle

            if (!app) {
                return this.renderOff()
            }
            if (Config.screenSize === 'small') {
                return (
                    <Tile
                        onClick="harmony"
                    >
                        <div>
                            <Image style={{width: 32, height: 'auto', marginRight: 10}} src={info.logo.URL}/>
                            <DenonButton
                                device={denon}
                                bsStyle={this.state.denon.mute === 'ON' ? 'danger' : 'default'}
                                command={this.state.denon.mute === 'ON' ? 'MUOFF' : 'MUON'}
                                buttonStyle={buttonStyle}
                            >
                                <Glyphicon glyph="volume-off"/>
                            </DenonButton>
                            <DenonButton
                                device={denon}
                                command="MVDOWN"
                                buttonStyle={buttonStyle}
                            >
                                <Glyphicon glyph="volume-down"/>
                            </DenonButton>
                            <DenonButton
                                device={denon}
                                command="MVUP"
                                buttonStyle={buttonStyle}
                            >
                                <Glyphicon glyph="volume-up"/>
                            </DenonButton>
                        </div>
                    </Tile>
                )
            }
            return (
                <Tile
                    onClick="harmony"
                    width="2"
                    height="2"
                >
                    <div style={{textAlign: 'center'}}>
                        <h4>{app.title}</h4>
                        <div>
                            <Image
                                style={{width: 64, height: 'auto'}}
                                src={app.largeIcon}
                                thumbnail
                                responsive
                            />
                        </div>
                        <div>
                            <Image
                                style={{width: 64, height: 'auto'}}
                                src={info.logo.URL}
                                thumbnail
                                responsive
                            />
                        </div>
                        <div>{tivo.channel}</div>
                        <div>
                            <DenonButton
                                device={denon}
                                bsStyle={this.state.denon.mute === 'ON' ? 'danger' : 'default'}
                                command={this.state.denon.mute === 'ON' ? 'MUOFF' : 'MUON'}
                                buttonStyle={buttonStyle}
                            >
                                <Glyphicon glyph="volume-off"/>
                            </DenonButton>
                            <DenonButton
                                device={denon}
                                command="MVDOWN"
                                buttonStyle={buttonStyle}
                            >
                                <Glyphicon glyph="volume-down"/>
                            </DenonButton>
                            <DenonButton
                                device={denon}
                                command="MVUP"
                                buttonStyle={buttonStyle}
                            >
                                <Glyphicon glyph="volume-up"/>
                            </DenonButton>
                        </div>
                    </div>
                </Tile>
            )
        }
        catch (e) {
            return null
        }
    }

    tvStateChange(topic, newState) {
        const state    = this.state || {},
              newValue = state.tv || {},
              key      = topic.substr(this.tv_status_topic.length)

        newValue[key] = newState
        this.setState({tv: newValue})
    }

    tivoStateChange(topic, newState) {
        const state    = this.state || {},
              newValue = state.tv || {},
              key      = topic.substr(this.tivo_status_topic.length)

        newValue[key] = newState
        this.setState({tivo: newValue})
    }

    tvguideStateChange(topic, newState) {
        const state    = this.state || {},
              newValue = state.tv || {},
              key      = topic.substr(this.guide_status_topic.length)

        newValue[key] = newState
        this.setState({tvguide: newValue})
    }

    denonStateChange(topic, newState) {
        const state    = this.state || {},
              newValue = state.tv || {},
              key      = topic.substr(this.denon_status_topic.length)

        newValue[key] = newState
        this.setState({denon: newValue})
    }

    componentDidMount() {
        if (this.denon) {
            MQTT.subscribe(this.denon_status_topic + 'MU', this.denonStateChange)
            MQTT.subscribe(this.denon_status_topic + 'MV', this.denonStateChange)
        }
        if (this.guide) {
            MQTT.subscribe(this.guide_status_topic + 'channels', this.tvguideStateChange)
        }
        if (this.tivo) {
            MQTT.subscribe(this.tivo_status_topic + 'channel', this.tivoStateChange)
        }
        if (this.tv) {
            MQTT.subscribe(this.tv_status_topic + 'foregroundApp', this.tvStateChange)
            MQTT.subscribe(this.tv_status_topic + 'launchPoints', this.tvStateChange)
        }
    }

    componentWillUnmount() {
        if (this.denon) {
            MQTT.unsubscribe(this.denon_status_topic + 'MU', this.denonStateChange)
            MQTT.unsubscribe(this.denon_status_topic + 'MV', this.denonStateChange)
        }
        if (this.guide) {
            MQTT.unsubscribe(this.guide_status_topic + 'channels', this.tvguideStateChange)
        }
        if (this.tivo) {
            MQTT.unsubscribe(this.tivo_status_topic + 'channel', this.tivoStateChange)
        }
        if (this.tv) {
            MQTT.unsubscribe(this.tv_status_topic + 'foregroundApp', this.tvStateChange)
            MQTT.unsubscribe(this.tv_status_topic + 'launchPoints', this.tvStateChange)
        }
    }
}
