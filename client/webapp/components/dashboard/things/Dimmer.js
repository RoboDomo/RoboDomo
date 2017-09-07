import Config from '../../../../Config'

import React from 'react'
import Label from 'react-bootstrap/lib/Label'

import MQTT from '../../../../lib/MQTT'

import Tile from '../Tile'

export default class Dimmer extends React.Component {
    constructor(props) {
        super(props)

        this.status_topic        = Config.mqtt.smartthings + '/' + props.name + '/'
        this.status_topic_length = this.status_topic.length
        this.set_topic           = this.status_topic

        this.onStateChange = this.onStateChange.bind(this)
        this.onClick       = this.onClick.bind(this)
    }

    renderSmall() {
        const state = this.state,
              props = this.props,
              on    = state.switch === 'on'

        return (
            <h3
                onClick={this.onClick}
            >
                {props.label}
                <Label
                    style={{marginLeft: 10}}
                    bsStyle={on ? 'success' : 'primary'}
                >
                    {on ? 'ON' : 'OFF'}
                </Label>
            </h3>
        )
    }

    render() {
        const state = this.state,
              props = this.props

        if (!state) {
            return null
        }

        if (Config.screenSize === 'small') {
            return this.renderSmall()
        }

        if (state.switch === 'off') {
            return (
                <Tile
                    style={{textAlign: 'center'}}
                    onClick={this.onClick}
                >
                    <div>
                        <div>{props.label}</div>
                        <div style={{fontSize: 30, textAlign: 'center'}}>Off</div>
                    </div>
                </Tile>
            )
        }
        return (
            <Tile
                backgroundColor="yellow"
                style={{textAlign: 'center'}}
                onClick={this.onClick}
            >
                <div>
                    <div>{props.label}</div>
                    <div style={{fontSize: 30, textAlign: 'center'}}>On</div>
                </div>
            </Tile>
        )
    }

    onStateChange(topic, newState) {
        const newVal = {}

        newVal[topic.substr(this.status_topic_length)] = newState
        this.setState(newVal)
    }

    componentDidMount() {
        MQTT.subscribe(this.status_topic + 'switch', this.onStateChange)
        MQTT.subscribe(this.status_topic + 'level', this.onStateChange)
    }

    componentWillUnmount() {
        MQTT.unsubscribe(this.status_topic + 'switch', this.onStateChange)
        MQTT.unsubscribe(this.status_topic + 'level', this.onStateChange)
    }

    onClick(e) {
        if (this.state.switch === 'on') {
            this.setState({switch: 'off'})
            MQTT.publish(this.set_topic + 'switch/set', 'off')
        }
        else {
            this.setState({switch: 'on'})
            MQTT.publish(this.set_topic + 'switch/set', 'on')
        }
    }
}
