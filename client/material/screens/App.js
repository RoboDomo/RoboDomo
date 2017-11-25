import React, {Component} from 'react'

import TopBar from '../components/TopBar'

import Home from './Home'

const routes = {
  '':   Home,
  home: Home,
//  mqtt:       MQTT,
//  devices:    Devices,
//  dashboards: Dashboards
}

export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    //    const Screen = routes[this.props.location]

    console.log('app Render')
    return (
      <div style={{paddingTop: 60}}>
        {' App '}
//        <TopBar />
//        <Screen />
      </div>
    )
  }
}
