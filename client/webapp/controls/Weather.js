import Config from '../../Config'

import React from 'react'

import Button from 'react-bootstrap/lib/Button'
import Table from 'react-bootstrap/lib/Table'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'

import MQTT from '../../lib/MQTT'

const styles = {
    container: {
        // display:  'inline-block',
        // width:    450,
        // flexGrow: 1,
        // flex:     .5
        // minWidth: 300
    },
    root:      {
        display:        'flex',
        flexWrap:       'wrap',
        justifyContent: 'space-around',
    },
    paper:     {
        backgroundColor: 'red',
        padding:         '10px',
        display:         'inline-block',
        // width: '200px'
    },
    h1:        {
        margin:   0,
        color:    'white',
        fontSize: '20px'
    },
    p:         {
        color:    'white',
        fontSize: '25px',
        margin:   0,
    },
    img:       {
        verticalAlign: 'middle',
        width:         64,
        height:        64,
        // float:         'left'
    },
    img_small: {
        verticalAlign: 'middle',
        width:         48,
        height:        48,
        float:         'left'

    },
    imgleft:   {
        verticalAlign: 'middle',
        width:         48,
        height:        48,
        // float:         'left'
    }
};

const dayOfWeek = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
]

class Weather extends React.Component {
    constructor(props) {
        super()
        this.location = props.location
        this.device   = props.location.device
        this.name     = props.location.name

        this.status_topic        = Config.mqtt.weather + '/' + this.device + '/status/'
        this.status_topic_length = this.status_topic.length

        this.onStateChange = this.onStateChange.bind(this)
    }

    renderHourly(hourly) {
        if (Config.screenSize === 'small') {
            return (
                <div
                    style={{
                        height: 200, overflow: 'auto'
                    }}
                >
                    <Table
                        striped
                        bordered
                        condensed
                        hover
                    >
                        <thead
                            style={{
                                position: 'relative',
                                // display: 'inline-block'
                            }}
                        >
                        <tr>
                            <th>Hour</th>
                            <th>Temp</th>
                            <th>Humidity</th>
                        </tr>
                        </thead>
                        <tbody
                            style={{}}
                        >
                        {hourly.map((o, i) => {
                            const d = new Date(o.time * 1000).toLocaleTimeString().replace(':00 ', ' ')

                            if (i < 0 || i > 23) {
                                return null
                            }
                            return (
                                <tr
                                    key={i}
                                >
                                    <td>{d}</td>
                                    <td>{o.temp}</td>
                                    <td>{o.humidity}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </div>
            )
        }
        return (
            <div
                onScroll={this.onScroll}
                style={{
                    position:   'relative',
                    height:     120,
                    width:      '100%',
                    textAlign:  'left',
                    whiteSpace: 'nowrap',
                    overflowX:  'auto',
                    overflowY:  'hidden',
                }}
            >
                {hourly.map((o, i) => {
                    const d = new Date(o.time * 1000).toLocaleTimeString().replace(':00 ', ' ')

                    if (i < 0 || i > 23) {
                        return null
                    }
                    return (
                        <div key={i} style={{
                            width:     100,
                            height:    100,
                            display:   'inline-block',
                            margin:    2,
                            padding:   5,
                            border:    '1px solid black',
                            textAlign: 'center'
                        }}>
                            <div style={{fontSize: 16, fontWeight: 'bold'}}>{d}</div>
                            <div style={{textAlign: 'center', fontSize: 24}}>{o.temp}&deg;</div>
                            <div style={{fontSize: 'smaller'}}>Humidity: {o.humidity}%</div>
                        </div>
                    )
                })}
            </div>
        )
    }

    renderDaily(daily) {
        if (Config.screenSize === 'small') {
            return (
                <div>
                    {daily.map((o, i) => {
                        const d       = new Date(o.date * 1000),
                              weekday = dayOfWeek[d.getDay()],
                              day     = d.getDate(),
                              month   = d.getMonth(),
                              header  = <div style={{fontWeight: 'bold'}}>{weekday} {month}/{day}</div>

                        return (
                            <div
                                key={i}
                                style={{
                                    border:  '1px solid black',
                                    padding: 5,
                                    clear:   'both'
                                }}
                            >
                                <h4>{header}</h4>
                                <img style={styles.imgleft}
                                     src={`/img/Weather/icons/black/${o.icon}.svg`}/>
                                <div>{o.conditions}</div>
                                <div>High: {o.high_temperature} &deg;F</div>
                                <div>Low: {o.low_temperature} &deg;F</div>
                            </div>
                        )
                    })}
                </div>
            )
        }
        return (
            <div style={{
                display: 'flex'
            }}>
                {daily.map((o, i) => {
                    const d       = new Date(o.date * 1000),
                          weekday = dayOfWeek[d.getDay()],
                          day     = d.getDate(),
                          month   = d.getMonth(),
                          header  = <div style={{fontWeight: 'bold'}}>{weekday} {month}/{day}</div>

                    return (
                        <div key={i} style={{
                            flex:      1,
                            height:    180,
                            margin:    2,
                            padding:   5,
                            border:    '1px solid black',
                            textAlign: 'center'
                        }}>
                            {header}
                            <img style={styles.img}
                                 src={`/img/Weather/icons/black/${o.icon}.svg`}/>
                            <div>{o.conditions}</div>
                            <div>High: {o.high_temperature} &deg;F</div>
                            <div>Low: {o.low_temperature} &deg;F</div>
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        try {
            if (!this.state) {
                return null
            }
            const small    = Config.screenSize === 'small',
                  state    = this.state,
                  header   = <div style={{fontSize: small ? 24 : 32, fontWeight: 'bold'}}>{state.display_city}
                      Weather</div>,
                  forecast = state.forecast,
                  daily    = forecast.daily,
                  hourly   = forecast.hourly,
                  now      = state.now,
                  sunrise  = new Date(now.sunrise * 1000).toLocaleTimeString().replace(':00 ', ' '),
                  sunset   = new Date(now.sunset * 1000).toLocaleTimeString().replace(':00 ', ' ')

            return (
                <div>
                    {header}
                    <h4>Current Conditions</h4>
                    <div style={{fontSize: small ? 24 : 30, float: 'right', marginTop: 5, marginBottom: 10}}>
                        <div>
                            <Glyphicon style={{fontSize: small ? 24 : 40}}
                                       glyph="flag"/> {now.wind_direction} {now.current_wind} MPH
                        </div>
                        <div style={{fontSize: 14, textAlign: 'right'}}>
                            Sunrise: {sunrise} / Sunset: {sunset}
                        </div>
                    </div>
                    <div style={{fontSize: 30, float: 'left', marginBottom: 10}}>
                        <img style={small ? styles.img_small : styles.img}
                             src={`/img/Weather/icons/black/${now.icon}.svg`}/>
                        {now.current_temperature}&deg;F
                        <div style={{fontSize: 14, textAlign: 'right'}}>
                            High: {daily[0].high_temperature}&deg; / Low: {daily[0].low_temperature}&deg;
                        </div>
                    </div>
                    <div style={{clear: 'both'}}/>

                    <h4>Hourly Forecast</h4>
                    {this.renderHourly(hourly)}
                    <h4>5 Day Forecast</h4>
                    {this.renderDaily(daily)}
                </div>
            )
        }
        catch (e) {
            // console.log('Weather render exception', e.stack)
            return null
        }
    }

    onScroll(e) {
        e.stopPropagation()
    }

    onStateChange(topic, newState) {
        const newVal = {}

        newVal[topic.substr(this.status_topic_length)] = newState
        this.setState(newVal)
    }

    componentDidMount() {
        MQTT.subscribe(this.status_topic + 'forecast', this.onStateChange)
        MQTT.subscribe(this.status_topic + 'hourly', this.onStateChange)
        MQTT.subscribe(this.status_topic + 'now', this.onStateChange)
        MQTT.subscribe(this.status_topic + 'display_city', this.onStateChange)
    }

    componentWillUnmount() {
        MQTT.unsubscribe(this.status_topic + 'forecast', this.onStateChange)
        MQTT.unsubscribe(this.status_topic + 'hourly', this.onStateChange)
        MQTT.unsubscribe(this.status_topic + 'now', this.onStateChange)
        MQTT.unsubscribe(this.status_topic + 'display_city', this.onStateChange)
    }
}

export default Weather
