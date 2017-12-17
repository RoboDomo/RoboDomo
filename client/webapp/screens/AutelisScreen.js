import Config from '../../Config'

import React from 'react'
import Autelis from '../controls/Autelis'

import Screen from '../components/Screen'

export default class AutelisScreen extends React.Component {
  render() {
    return (
      <Screen
        header="Autelis"
        bsStyle={Config.ui.panelType}
        tabState="autelis"
      >
        {Config.autelis.controllers.map((controller, ndx) => {
          const key    = 'tivo-' + ndx,
                device = controller.device
          return (
            <Autelis
              device={device}
              deviceMap={controller.deviceMap}
              key={key}
              eventKey={ndx}
              title={controller.name}
              controller={controller}
            />
          )
        })}
      </Screen>
    )
  }
}
