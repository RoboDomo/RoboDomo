import Config from '../../../Config'

import React from 'react'
import Tile from './Tile'
import MQTT from '../../../lib/MQTT'

const topics = [
    'spaHeat',
    'spa',
    'jet',
    'blower',
    'spaLight'
]

export default class SpaTile extends React.Component {
    constructor(props) {
        super(props)
        this.controller    = Config.autelis.controllers[0]
        this.deviceMap           = this.controller.deviceMap
        this.status_topic        = Config.mqtt.autelis + '/status/'
        this.status_topic_length = this.status_topic.length
        this.onStateChange = this.onStateChange.bind(this)
    }

    isOn(thing) {
        const state   = this.state,
              control = state[thing]

        if (!control) {
            return false
        }
        return control.toLowerCase() === 'on'
    }

    render() {
        try {
            if (!this.state) {
                return null
            }

            const me              = this,
                  state           = this.state,
                  on              = this.isOn('spa')
                      || this.isOn('spaHeat')
                      || this.isOn('jet')
                      || this.isOn('blower')
                      || this.isOn('spaLight'),
                  backgroundColor = on ? 'red' : 'white',
                  color           = on ? 'white' : 'black'

            function renderControl(ndx, text, big) {
                const thing = state[ndx]
                if (thing && thing.toLowerCase() !== 'on') {
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

            function renderSpa(state) {
                if (on) {
                    return (
                        <div>
                            {renderControl('spa', `Spa ${state.spaTemp}°F`, true)}
                            {renderControl('spaHeat', 'Heat On')}
                            {renderControl('jet', 'Jets On')}
                            {renderControl('blower', 'Blower On')}
                            {renderControl('spaLight', 'Light On')}
                        </div>
                    )
                }
                else {
                    return (
                        <div>
                            <div style={{fontSize: 60}}>
                                Spa Off
                            </div>
                        </div>
                    )
                }
            }

            return (
                <Tile
                    backgroundColor={backgroundColor}
                    color={color}
                    width="2"
                    height="1"
                    onClick="poolcontrol"
                >
                    <div style={{textAlign: 'center'}}>
                        {renderSpa(this.state)}
                    </div>
                </Tile>
            )
        }
        catch (e) {
            console.log('SpaTile render exception', e.stack)
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
