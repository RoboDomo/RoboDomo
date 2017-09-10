// ThermostatScreen

import Config from '../../Config'

import React, {Component} from 'react'
import Nest from '../controls/Nest'

import Screen from '../components/Screen'

export default class ThermostatScreen extends Component {
  render() {
    return (
      <Screen
        header="Nest Thermostat"
        tabState="nest"
      >
        {Config.nest.thermostats.map((thermostat, ndx) => {
          const key = 'nest-' + ndx
          return (
            <Nest
              key={key}
              eventKey={ndx}
              title={thermostat.name}
              thermostat={thermostat}
            />
          )
        })}
      </Screen>
    )
  }
}
