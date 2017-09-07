import React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
// import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import TopBar from '../components/TopBar'
import Home from './Home'
import MQTT from './MQTT'
import Devices from './Devices'
import Dashboards from './Dashboards'

const routes = {
  '':         Home,
  home:       Home,
  mqtt:       MQTT,
  devices:    Devices,
  dashboards: Dashboards
}

import {
  indigo500, indigo700, redA200,
  grey400, pinkA200, grey100, grey500, darkBlack, white, grey300, cyan500, fullBlack
} from 'material-ui/styles/colors'

// console.log(indigo500, indigo700, redA200)

const muiTheme = getMuiTheme(Object.assign({}, baseTheme, {
  palette: {
    primary1Color:     indigo500,
    primary2Color:     indigo700,
    accent1Color:      redA200,
    pickerHeaderColor: indigo500,
    // primary3Color:      grey400,
    // accent1Color:       pinkA200,
    // accent2Color:       grey100,
    // accent3Color:       grey500,
    // textColor:          darkBlack,
    // alternateTextColor: white,
    // canvasColor:        white,
    // borderColor:        grey300,
    // pickerHeaderColor:  cyan500,
    // shadowColor:        fullBlack,
  }
}))
// const muiTheme = getMuiTheme(baseTheme)
// console.dir(muiTheme)

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {dirty: false}
    this.store  = props.store
    this.dirty = this.dirty.bind(this)
  }

  render() {
    const Component = routes[this.props.location]

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={{paddingTop: 60}}>
          <TopBar
            dirty={this.state.dirty}
          />
          <Component
            dirty={this.dirty}
            store={this.store}
          />
        </div>
      </MuiThemeProvider>
    )
  }

  dirty(bool) {
    this.setState({dirty: bool})
  }
}
