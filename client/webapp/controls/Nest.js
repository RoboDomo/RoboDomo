import Config from '../../Config'
import React from 'react'

import Form from 'react-bootstrap/lib/Form'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

import Thermostat from 'react-nest-thermostat'
import DisplayField from '../components/form/DisplayField'
import NumberField from '../components/form/NumberField'

import MQTT from '../../lib/MQTT'

/**
 * Operating Mode: COOL, AUTO (ECO),
 */

const thermostatTopics = [
    'device',
    'name',
    'structure_name',
    'postal_code',
    'away',
    'ambient_temperature_f',
    'target_temperature_f',
    'hvac_state',
    'has_leaf',
    'humidity',
    'time_to_target',
    'hvac_mode',
]

const weatherTopics = [
    'now',
    'forecast'
]

class Nest extends React.Component {
    constructor(props) {
        super()

        this.state         = null
        this.onStateChange = this.onStateChange.bind(this)
        this.thermostat    = props.thermostat
        this.device        = props.thermostat.device
        this.name          = props.thermostat.name

        this.thermostat_status_topic        = Config.mqtt.nest + '/' + this.device + '/status/'
        this.thermostat_status_topic_length = this.thermostat_status_topic.length
        this.set_topic                      = this.thermostat_status_topic.replace('status', 'set')

        this.setTargetTemperature = this.setTargetTemperature.bind(this)
    }

    renderConditions() {
        const thermostat = this.state.thermostat,
              weather    = this.state.weather || {},
              now        = weather.now

        if (!now || !now.conditions) {
            return (
                <Form horizontal>
                    <DisplayField
                        label="Location"
                        value={thermostat.structure_name + ' (' + thermostat.postal_code + ')'}
                    />
                </Form>
            )
        }
        return (
            <Form horizontal>
                <DisplayField
                    label="Location"
                    value={thermostat.structure_name + ' (' + thermostat.postal_code + ')'}
                />
                <DisplayField
                    label="Temperature"
                    value={now.conditions + ' ' + now.current_temperature + '&deg;F'}
                />
                <DisplayField
                    label="High"
                    value={weather.forecast.daily[0].high_temperature + '&deg;F'}
                />
                <DisplayField
                    label="Low"
                    value={weather.forecast.daily[0].low_temperature + '&deg;F'}
                />
                <DisplayField
                    label="Humidity"
                    value={now.current_humidity + '%'}
                />
                <DisplayField
                    label="Wind"
                    value={now.wind_direction + ' ' + now.current_wind + ' MPH '}
                />
                <DisplayField
                    label="Sunrise"
                    value={new Date(now.sunrise * 1000).toLocaleTimeString().replace(':00 ', ' ')}
                />
                <DisplayField
                    label="Sunset"
                    value={new Date(now.sunset * 1000).toLocaleTimeString().replace(':00 ', ' ')}
                />
            </Form>
        )

    }

    render() {
        if (!this.state) {
            return null
        }

        try {
            const thermostat = this.state.thermostat,
                  weather    = this.state.weather || {},
                  now        = weather.now

            return (
                <div>
                    <div>
                        <div
                            style={{textAlign: 'center', marginTop: 20, marginBottom: 20}}
                        >
                            <Thermostat
                                style={{textAlign: 'center '}}
                                width="180px" height="180px"
                                away={Boolean(thermostat.away !== 'home')}
                                ambientTemperature={thermostat.ambient_temperature_f}
                                targetTemperature={thermostat.target_temperature_f}
                                hvacMode={thermostat.hvac_state}
                                leaf={thermostat.has_leaf}
                            />
                        </div>

                        <Row>
                            <Col sm={6}>
                                <Form horizontal>
                                    <NumberField
                                        label="Target Temperature"
                                        value={thermostat.target_temperature_f}
                                        onValueChange={this.setTargetTemperature}
                                    />
                                    <DisplayField
                                        label="Inside Humidity"
                                        value={thermostat.humidity + '%'}
                                    />
                                    <DisplayField
                                        label="Inside Temp"
                                        value={thermostat.ambient_temperature_f + '&deg;F'}
                                    />
                                    <DisplayField
                                        label="Time to Target"
                                        value={thermostat.time_to_target}
                                    />
                                    <DisplayField
                                        label="Mode"
                                        value={thermostat.hvac_mode.toUpperCase()}
                                    />
                                    <DisplayField
                                        label="Operating State"
                                        value={thermostat.hvac_state.toUpperCase()} // state.thermostatOperatingState.toUpperCase()}
                                    />
                                    <DisplayField
                                        label="Presence"
                                        value={thermostat.away.toUpperCase()}
                                    />
                                </Form>
                            </Col>
                            <Col sm={6}>
                                {this.renderConditions()}
                            </Col>
                        </Row>
                    </div>
                </div>
            )
        }
        catch (e) {
            return null
            // const emsg = e.stack
            // return (
            //     <div>
            //         <h1>Exception</h1>
            //         <div dangerouslySetInnerHTML={{__html: emsg}}></div>
            //     </div>
            // )
        }
    }

    onStateChange(topic, newState) {
        const state = this.state || {}

        if (topic.startsWith(Config.mqtt.nest)) {
            const key        = topic.substr(this.thermostat_status_topic_length),
                  thermostat = state.thermostat || {}

            thermostat[key] = newState
            this.setState({thermostat: thermostat})
            if (!this.weather_status_topic && thermostat.postal_code) {
                const t = this.weather_status_topic = Config.mqtt.weather + '/' + thermostat.postal_code + '/status/'
                this.weather_status_topic_length = this.weather_status_topic.length

                weatherTopics.forEach((topic) => {
                    MQTT.subscribe(t + topic, this.onStateChange)
                })
            }
        }
        else {
            const key     = topic.substr(this.weather_status_topic_length),
                  weather = state.weather || {}

            weather[key] = newState
            this.setState({weather: weather})
        }
    }

    componentDidMount() {
        const status_topic = this.thermostat_status_topic

        setTimeout(() => {
            thermostatTopics.forEach((topic) => {
                MQTT.subscribe(status_topic + topic, this.onStateChange)
            })
        })
    }

    componentWillUnmount() {
        const status_topic = this.thermostat_status_topic

        if (this.weather_status_topic) {
            const t = Config.mqtt.weather + '/' + this.state.thermostat.postal_code + '/status/'

            weatherTopics.forEach((topic) => {
                MQTT.unsubscribe(t + topic, this.onStateChange)
            })
        }

        thermostatTopics.forEach((topic) => {
            MQTT.unsubscribe(status_topic + topic, this.onStateChange)
        })

    }

    setTargetTemperature(temp) {
        MQTT.publish(this.set_topic + '/target_temperature_f', temp)
    }
}

export default Nest
