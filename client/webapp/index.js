import Config from '../Config'
import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import injectTapEventPlugin from 'react-tap-event-plugin'
import createHistory from 'history/createBrowserHistory'

// CSS
import 'react-bootstrap-toggle/dist/bootstrap2-toggle.css'
import 'react-bootstrap-slider/src/css/bootstrap-slider.min.css'

import Root from './screens/Root'

import MQTT from '../lib/MQTT'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const history = createHistory()

MQTT.once('connect', () => {
  const routes = Config.routes

  function render(loc, action) {
    console.log('location', loc, action)
    const hash      = loc.hash.substr(1) || 'dashboard',
          entry     = routes[hash] || routes.notFound,
          Component = entry.screen

    console.log('hash', hash)
    renderComponent(Component)
  }

  function renderComponent(Component) {
    ReactDOM.render(
      <AppContainer>
        <Root>
          <Component/>
        </Root>
      </AppContainer>,
      document.getElementById('root')
    )
  }

  render(history.location)
  history.listen(render)
})

MQTT.connect()
if (module.hot) {
  module.hot.accept('./screens/Root', () => {
    render(history.location)
  })
}
