import Config from '../../Config'

import React, {Component} from 'react'
import Screen from '../components/Screen'

import Weather from '../controls/Weather'

export default class WeatherScreen extends Component {
  state = null
  constructor() {
    super()
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
