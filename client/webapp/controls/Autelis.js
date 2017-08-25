import Config from '../../Config'

import React from 'react'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Panel from 'react-bootstrap/lib/Panel'

import Form from 'react-bootstrap/lib/Form'
import ToggleField from '../components/form/ToggleField'
import NumberField from '../components/form/NumberField'

import MQTT from '../../lib/MQTT'

const poolControlHeader = <h1>Pool Controls</h1>,
      spaControlHeader  = <h1>Spa Controls</h1>

const topics = [
    'pump', 'spa', 'spaTemp', 'poolTemp', 'poolSetpoint', 'spaSetpoint', 'cleaner', 'waterfall',
    'poolLight', 'spaLight', 'jet', 'blower', 'spaHeat'
]

export default class Autelis extends React.Component {
    constructor(props) {
        super()
        this.controller          = props.controlelr
        this.device              = props.controller.device
        this.deviceMap           = props.deviceMap
        this.state               = null
        this.onStateChange       = this.onStateChange.bind(this)
        this.status_topic        = Config.mqtt.autelis + '/status/'
        this.status_topic_length = this.status_topic.length
        this.set_topic           = Config.mqtt.autelis + '/set/'
    }

    renderPoolTemperature() {
        const state = this.state
        if (!state || state.pump !== 'on') {
            return <div>Pool pump is off</div>
        }
        return <div>Pool Temperature {state.poolTemp}&deg; F</div>
    }

    renderSpaTemperature() {
        const state = this.state

        if (!state || state.spa !== 'on') {
            return <div>Spa is off</div>
        }
        else if (state.spaTemp === 0) {
            return <div>Spa is warming up</div>
        }
        return <div>Spa Temperature {state.spaTemp}&deg; F</div>
    }

    render() {
        try {
            const state = this.state

            if (!state || !state.poolSetpoint || !state.spaSetpoint) {
                return (
                    <h1>Connecting...</h1>
                )
            }

            return (
                <Row style={{marginTop: 20}}>
                    <Col sm={6}>
                        <Panel
                            style={{width: '100%'}}
                            header={poolControlHeader}
                            bsStyle={Config.ui.subPanelType}
                        >
                            <div style={{fontSize: 25, textAlign: 'center', marginBottom: 20}}>
                                {this.renderPoolTemperature()}
                            </div>
                            <Form horizontal>
                                <ToggleField
                                    label="Pump"
                                    name="pump"
                                    toggled={state.pump === 'on'}
                                    onToggle={this.toggleHandler.bind(this)}
                                />
                                <ToggleField
                                    label="Cleaner"
                                    name="cleaner"
                                    toggled={state.cleaner === 'on'}
                                    onToggle={this.toggleHandler.bind(this)}
                                />
                                <ToggleField
                                    label="Waterfall"
                                    name="waterfall"
                                    toggled={state.waterfall === 'on'}
                                    onToggle={this.toggleHandler.bind(this)}
                                />
                                <ToggleField
                                    label="Pool Light"
                                    name="poolLight"
                                    toggled={state.poolLight === 'on'}
                                    onToggle={this.toggleHandler.bind(this)}
                                />
                                <ToggleField
                                    label="Pool Heat"
                                    name="poolHeat"
                                    toggled={state.poolHeat === 'on'}
                                    onToggle={this.togglePoolHeat.bind(this)}
                                />
                                <NumberField
                                    label="Pool Setpoint"
                                    name="poolSetpoint"
                                    value={state.poolSetpoint}
                                    onValueChange={this.setPoolSetpoint.bind(this)}
                                />
                            </Form>
                        </Panel>
                    </Col>
                    <Col sm={6}>
                        <Panel
                            style={{width: '100%'}}
                            header={spaControlHeader}
                            bsStyle={Config.ui.subPanelType}
                        >
                            <div style={{fontSize: 25, textAlign: 'center', marginBottom: 20}}>
                                {this.renderSpaTemperature()}
                            </div>
                            <Form horizontal>
                                <ToggleField
                                    label="Spa"
                                    name="spa"
                                    toggled={state.spa === 'on'}
                                    onToggle={this.toggleHandler.bind(this)}
                                    // onChange={this.toggleSpa.bind(this)}
                                />
                                <ToggleField
                                    label="Spa Light"
                                    name="spaLight"
                                    toggled={state.spaLight === 'on'}
                                    onToggle={this.toggleHandler.bind(this)}
                                />
                                <ToggleField
                                    label="Jets"
                                    name="jet"
                                    toggled={state.jet === 'on'}
                                    onToggle={this.toggleHandler.bind(this)}
                                />
                                <ToggleField
                                    label="Air Blower"
                                    name="blower"
                                    toggled={state.blower === 'on'}
                                    onToggle={this.toggleHandler.bind(this)}
                                />
                                <ToggleField
                                    label={`Spa Heat`}
                                    name="spaHeat"
                                    toggled={['on', 'enabled'].indexOf(state.spaHeat) !== -1}
                                    onToggle={this.toggleSpaHeat.bind(this)}
                                />
                                <NumberField
                                    label="Spa Setpoint"
                                    name="spaSetpoint"
                                    value={state.spaSetpoint}
                                    onValueChange={this.setSpaSetpoint.bind(this)}
                                />
                            </Form>
                        </Panel>
                    </Col>
                </Row>
            )
        }
        catch (e) {
            return null
        }
    }

    onStateChange(topic, newState) {
        console.log('statechange', topic, newState)
        const newValue = {},
              what     = topic.substr(this.status_topic_length),
              key      = this.deviceMap.backward[what] || what


        newValue[key] = newState
        console.log('statechange', newValue)
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

    control(what, state) {
        const deviceMap = this.deviceMap.forward,
              key = deviceMap[what] || what
        if (typeof state !== 'number') {
            state = state ? 'on' : 'off'
        }
        MQTT.publish(this.set_topic + key, state)
        // this.api.set(what, state)

        const newState = {}
        newState[what] = state
        this.setState(newState)
    }

    toggleHandler(name, state) {
        this.control(name, state)
    }

    toggleSpaHeat(name, state) {
        this.control('spaHeat', state)
    }

    setSpaSetpoint(temp) {
        if (state && state.spaSetpoint !== temp) {
            this.control('spaSetpoint', temp)
        }
    }

    togglePoolHeat(name, state) {
        this.control('poolHeat', state)
    }

    setPoolSetpoint(temp) {
        const state = this.state

        if (state && state.poolSetpoint !== temp) {
            this.control('poolSetpoint', temp)
        }
    }
}
