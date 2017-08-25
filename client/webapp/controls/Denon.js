import Config from '../../Config'
import React from 'react'

import Form from 'react-bootstrap/lib/Form'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

import DisplayField from '../components/form/DisplayField'
import NumberField from '../components/form/NumberField'
import ToggleField from '../components/form/ToggleField'

import DenonButton from '../../common/MQTTButton'

import MQTT from '../../lib/MQTT'

// Volume is a 2 or 3 digit string
// "53" is 53.0
// "535" is 53.5
function volume(v) {
    if (!v) {
        return 0
    }
    if (typeof v === 'number') {
        return v
    }
    if (v.length === 3) {
        return Number(v) / 10
    }
    return Number(v)
}

const topics = [
    'MV',       // Master Volume
    'CVC',      // Center Volume
    'PW',       // Power
    'ST',       // Input Source
    'DC',       // Digital Input
    'SD',       // Input Mode
    'MS',       // Surround Mode
    'MU',       // Mute
]

export default class Denon extends React.Component {
    constructor(props) {
        super()
        if (!props.device) {
            throw new Error('Denon requires prop device')
        }
        this.state  = null
        this.device = props.device

        this.status_topic        = Config.mqtt.denon + '/' + this.device + '/status/'
        this.status_topic_length = this.status_topic.length
        this.set_topic = this.status_topic.replace('status', 'set') + 'command'

        this.onStateChange = this.onStateChange.bind(this)
    }

    render() {
        try {
            if (!this.state || this.state.MV === undefined || this.state.CVC === undefined) {
                return (
                    <h1>Connecting...</h1>
                )
            }
            const state = this.state,
                  topic = this.set_topic

            return (
                <Row>
                    <Col sm={1} style={{marginTop: 10, textAlign: 'center'}}>
                        <DenonButton
                            topic={topic}
                            command="MSAUTO"
                        >
                            Auto
                        </DenonButton>
                        <DenonButton
                            topic={topic}
                            command="MSMOVIE"
                        >
                            Movie
                        </DenonButton>
                        <DenonButton
                            topic={topic}
                            command="MSMUSIC"
                        >
                            Music
                        </DenonButton>
                    </Col>
                    <Col sm={11} style={{marginTop: 10}}>
                        <Form horizontal>
                            <ToggleField
                                name="denon-power"
                                label="Power"
                                toggled={state.PW === 'ON'}
                                onToggle={this.togglePower.bind(this)}
                            />
                            <DisplayField label="Input Source" value={state.SI}/>
                            <DisplayField label="Digital Input Mode" value={state.DC}/>
                            <DisplayField label="Input Mode" value={state.SD}/>
                            <DisplayField label="Surround Mode" value={state.MS}/>
                            <ToggleField
                                name="denon-mute"
                                label="Mute"
                                toggled={state.MU === 'ON'}
                                onToggle={this.toggleMute.bind(this)}
                            />
                            <NumberField
                                label="Master Volume"
                                name="masterVolume"
                                value={volume(state.MV)}
                                step={.5}
                                min={0}
                                precision={2}
                                max={100}
                                onValueChange={this.onVolumeChange.bind(this)}
                            />
                            <NumberField
                                label="Center Volume"
                                name="centerVolume"
                                value={volume(state.CVC)}
                                step={.5}
                                min={38}
                                precision={2}
                                max={62}
                                onValueChange={this.onCenterVolumeChange.bind(this)}
                            />
                        </Form>
                    </Col>
                </Row>
            )
        }
        catch (e) {
            return null
        }
    }

    onVolumeChange(value, slider) {
        this.setState({MV: value})
        MQTT.publish(this.set_topic, 'MV'+value)
    }

    onCenterVolumeChange(value, slider) {
        this.setState({CVC: value})
        MQTT.publish(this.set_topic, 'CVC'+value)
    }

    togglePower(name, state, toggle) {
        MQTT.publish(this.set_topic, 'PW' + (state ? 'ON' : 'STANDBY'))
    }

    toggleMute(name, state, toggle) {
        MQTT.publish(this.set_topic, 'MU' + (state ? 'ON' : 'OFF'))
    }

    onStateChange(topic, newState) {
        const newValue = {},
              key     = topic.substr(this.status_topic_length)

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

