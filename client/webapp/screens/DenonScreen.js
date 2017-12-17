import React from 'react'
import Config from '../../Config'

import Screen from '../components/Screen'

import Denon from '../controls/Denon'

export default class DenonScreen extends React.Component {
  constructor(props) {
    super()
    this.state = null
  }

  render() {
    return (
      <Screen
        header="Denon"
        tabState="denon"
      >
        {Config.denon.receivers.map((receiver, ndx) => {
          return (
            <Denon
              key={'denon'+ndx}
              eventKey="0"
              title={receiver.name}
              device={receiver.device}
            />
          )
          
        })}
      </Screen>
    )
  }
}
