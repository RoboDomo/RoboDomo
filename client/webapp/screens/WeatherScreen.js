/**
 * Created by mykes on 6/26/2017.
 */

import Config from '../../Config'

import React from 'react'
import Screen from '../components/Screen'

import Weather from '../controls/Weather'

export default class WeatherScreen extends React.Component {
    constructor(props) {
        super()
        this.state = null
    }

    render() {
        return (
            <Screen
                header="Weather"
                tabState="weather"
            >
                {Config.weather.locations.map((location, ndx) => {
                    const key = 'tivo-' + ndx
                    return (
                        <Weather
                            key={key}
                            eventKey={ndx}
                            title={location.name}
                            location={location}
                        />
                    )
                })}
            </Screen>
        )
    }
}
