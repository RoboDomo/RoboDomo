// Starting point for Configuration Web App
// SETUP.JS

import Config from '../Config'
import React from 'react'
import ReactDOM from 'react-dom'

import {AppContainer} from 'react-hot-loader'
import injectTapEventPlugin from 'react-tap-event-plugin'
import createHistory from 'history/createBrowserHistory'

import { createStore } from 'redux'
import reducer from './reducers'

// CSS
import 'flexboxgrid/css/flexboxgrid.min.css'

import App from './screens/App'

import MQTT from '../lib/MQTT'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const history = createHistory()

//const routes = Config.routes
const store = createStore(reducer)

function render(loc) {
  console.log('location', loc)
  const hash      = loc.hash.substr(1) || 'dashboard'

  console.log('hash', hash)
  ReactDOM.render(
    <AppContainer>
      <App
        location={loc.hash.substr(1)}
        store={store}
      />
    </AppContainer>,
    document.getElementById('root')
  )
}

MQTT.once('connect', () => {

  // MQTT.subscribe('+/#', (topic, message) => {
  //     console.log(topic, '=>', message.toString())
  // })

  render(history.location)
  history.listen(render)
  store.subscribe(() => render(history.location))
})

MQTT.connect()
if (module.hot) {
  module.hot.accept('./screens/App', () => {
    render(history.location)
  })
}
