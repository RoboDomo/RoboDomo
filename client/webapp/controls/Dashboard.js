import Config from '../../Config'

import React from 'react'

// import Tile from '../components/dashboard/Tile'
import ClockTile from '../components/dashboard/ClockTile'
import MacroTile from '../components/dashboard/MacroTile'
import WeatherTile from '../components/dashboard/WeatherTile'
import PoolTile from '../components/dashboard/PoolTile'
import SpaTile from '../components/dashboard/SpaTile'
import TheaterTile from '../components/dashboard/TheaterTile'
import ThermostatTile from '../components/dashboard/ThermostatTile'
import SmartThingsTile from '../components/dashboard/SmartThingsTile'
import LinkTile from '../components/dashboard/LinkTile'

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.tiles = props.tiles
  }

  renderList() {
    let key = 0

    return (
      <div style={{
        overflow:      'auto',
        height:        '100%',
        paddingBottom: 100
      }}
      >
        {this.tiles.map((tile) => {
          switch (tile.type) {
            case 'clock':
              return (
                <ClockTile
                  key={++key}
                />
              )
            case 'weather':
              return (
                <WeatherTile
                  key={++key}
                />
              )
            case 'pool':
              return (
                <PoolTile
                  key={++key}
                />
              )
            case 'spa':
              return (
                <SpaTile
                  key={++key}
                />
              )
            case 'thermostat':
              return (
                <ThermostatTile
                  key={++key}
                  device={tile.device}
                />
              )
            case 'macro':
              return (
                <MacroTile
                  key={++key}
                  config={tile}
                />
              )
            case 'theater':
              return (
                <TheaterTile
                  key={++key}
                  config={tile}
                />
              )
            case 'smartthings':
              return (
                <div key={++key}>
                  {tile.controls.map((control) => {
                    return (
                      <SmartThingsTile
                        key={++key}
                        tile={tile}
                        control={control}
                      />
                    )
                  })
                  }
                </div>
              )
            case 'link':
              return (
                <LinkTile
                  key={++key}
                  href={tile.href}
                  label={tile.label}
                />
              )
            default:
              console.log('invalid tile', tile)
              return null
          }
        })}
      </div>
    )
  }

  render() {
    if (Config.screenSize === 'small') {
      return this.renderList()
    }

    let key = 0

    return (
      <div
        style={{marginTop: 2}}
      >
        {this.tiles.map((tile) => {
          switch (tile.type) {
            case 'clock':
              return <ClockTile
                key={++key}
                     />
            case 'macro':
              return (
                <MacroTile
                  key={++key}
                  config={tile}
                />
              )
            case 'weather':
              return <WeatherTile
                key={++key}
                     />
            case 'pool':
              return <PoolTile
                key={++key}
                     />
            case 'spa':
              return <SpaTile
                key={++key}
                     />
            case 'thermostat':
              return <ThermostatTile
                key={++key}
                device={tile.device}
                     />
            case 'theater':
              return (
                <TheaterTile
                  key={++key}
                  config={tile}
                />
              )
            case 'smartthings':
              return (
                <div key={++key}>
                  {tile.controls.map((control) => {
                    return (
                      <SmartThingsTile
                        key={++key}
                        tile={tile}
                        control={control}
                      />
                    )
                  })
                  }
                </div>
              )
            case 'link':
              return (
                <LinkTile
                  key={++key}
                  onClick={tile.href}
                  label={tile.label}
                />
              )
            default:
              console.log('invalid tile', tile)
              return null
          }
        })}
      </div>
    )
  }
}
