import Config from '../../Config'

import React, {Component} from 'react'

import MQTT from '../../lib/MQTT'

import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import Navbar from 'react-bootstrap/lib/Navbar'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import JumboTron from 'react-bootstrap/lib/Jumbotron'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import DeviceDialog from '../components/harmony/DeviceDialog'

// import Loader from 'halogen/BeatLoader'
// import Loader from 'halogen/ClipLoader'
import Loader from 'halogen/ScaleLoader'

import RemoteButton from '../../common/MQTTButton'
import RemoteControl from '../components/harmony/RemoteControl'

const topics = [
  'activities',
  'devices',
  'currentActivity',
  'startingActivity',
]

export default class Harmony extends Component {
  constructor(props) {
    super(props)

    const hub         = props.hub
    this.hub          = hub
    this.device       = hub.device
    this.favorites    = hub.favorites
    this.state        = null
    this.favoritesTop = 0

    this.status_topic        = Config.mqtt.harmony + '/' + this.device + '/status/'
    this.status_topic_length = this.status_topic.length
    this.set_topic           = this.status_topic.replace('status', 'set')

    this.onStateChange    = ::this.onStateChange
    this.chooseActivity   = ::this.chooseActivity
    this.chooseDevice     = ::this.chooseDevice
    this.renderButton     = ::this.renderButton
    this.renderMiniButton = ::this.renderMiniButton
    this.fixit            = ::this.fixit
  }

  deviceCommand(device, slug) {
    MQTT.publish(this.set_topic + 'device/' + device, slug)
  }

  command(command) {
    MQTT.publish(this.set_topic + 'command', command)
  }

  startActivity(key) {
    if (!key || !key.id) {
      key = { id: -1 }
    }
    MQTT.publish(this.set_topic + 'activity', key.id)
  }

  chooseActivity(e) {
    const key      = e.target.getAttribute('data-key'),
          activity = this.state.activities[key]

    this.startActivity(activity)
  }

  chooseDevice(e) {
    const key    = e.target.getAttribute('data-key'),
          device = this.state.devices[key]

    this.setState({currentDevice: device})
  }

  isActivityStarting() {
    const state = this.state
    return Boolean(state && state.startingActivity)
  }

  renderButton(command, text, bsStyle, buttonStyle) {
    if (!text) {
      text = command
    }
    return (
      <RemoteButton
        topic={this.set_topic + 'command'}
        value={command}
        bsStyle={bsStyle}
        buttonStyle={buttonStyle}
      >
        {text}
      </RemoteButton>
    )
  }

  renderMiniButton(command, text, style) {
    return (
      <RemoteButton
        topic={this.set_topic + 'command'}
        value={command}
        buttonStyle={Config.ui.miniButtonStyle}
        bsStyle={style}
      >
        {text}
      </RemoteButton>

    )
  }

  renderActivities() {
    const activities       = this.state.activities,
          activitiesSorted = Object.keys(activities).sort((a, b) => activities[a].activityOrder > activities[b].activityOrder)

    return (
      <NavDropdown title="Activities" id="activities-dropdown">
        {activitiesSorted.map((key) => {
          const dkey             = 'harmony-' + this.device + '-' + key,
                activity         = activities[key],
                label            = activity.label,
                currentActivity  = this.state.currentActivity,
                startingActivity = this.state.startingActivity,
                disabled         = Boolean(startingActivity !== currentActivity)

          if (~label.toLowerCase().indexOf('mood') || label === 'PowerOff') {
            return null
          }

          return (
            <MenuItem
              key={dkey}
              eventKey={key}
              data-key={key}
              onClick={this.chooseActivity}
              disabled={disabled}
            >
              {label}
            </MenuItem>
          )
        })}
      </NavDropdown>
    )
  }

  renderDevices() {
    const state           = this.state,
          currentActivity = state.currentActivity,
          activity        = state.activities[currentActivity],
          devices         = state.devices,
          activityDevices = state.activityDevices

    if (currentActivity === -1) {
      return (
        <NavDropdown title="Devices" id="devices-dropdown">
          <MenuItem header>All Devices</MenuItem>
          {Object.keys(devices).map((key) => {
            const dkey     = 'harmony-' + this.device + '-' + key,
                  device   = devices[key],
                  label    = device.label,
                  disabled = state.startingActivity !== '-1' && state.startingActivty !== null

            return (
              <MenuItem
                key={dkey}
                onClick={this.chooseDevice}
                data-key={key}
                disabled={disabled}
              >
                {label}
              </MenuItem>
            )
          })}
        </NavDropdown>
      )
    }
    else {
      return (
        <NavDropdown title="Devices" id="devices-dropdown">
          <MenuItem header>{activity.label}</MenuItem>
          {Object.keys(devices).map((key) => {
            const dkey     = 'harmony-' + this.device + '-' + key,
                  device   = devices[key],
                  label    = device.label,
                  disabled = this.isActivityStarting()

            if (device.type.toLowerCase() === 'television' || activityDevices[key]) {
              return (
                <MenuItem
                  key={dkey}
                  onClick={this.chooseDevice}
                  data-key={key}
                  disabled={disabled}
                >
                  {label}
                </MenuItem>
              )
            }
            else {
              return null
            }
          })}
          <MenuItem divider/>
          <MenuItem header>Others</MenuItem>
          {Object.keys(devices).map((key) => {
            const dkey     = 'harmony-' + this.device + '-' + key,
                  device   = devices[key],
                  label    = device.label,
                  disabled = this.isActivityStarting()

            if (device.type !== 'television' && !activityDevices[key]) {
              return (
                <MenuItem
                  key={dkey}
                  onClick={this.chooseDevice}
                  data-key={key}
                  disabled={disabled}
                >
                  {label}
                </MenuItem>
              )
            }
            else {
              return null
            }
          })}
        </NavDropdown>
      )

    }
  }

  /**
     *
     * @returns {Promise}
     */
  async fixit() {
    const currentActivity = this.state.currentActivity,
          devices         = this.state.devices,
          activities      = this.state.activities,
          activity        = activities[currentActivity],
          fixit           = activity.fixit,
          api             = this.api


    return new Promise(async (resolve, reject) => {
      for (const dev of Object.keys(fixit)) {
        const device = devices[dev],
              fix    = fixit[dev]

        try {
          if (fix.Power === 'On') {
            try {
              await api.deviceCommand(device.slug, 'power-on')
            }
            catch (e) {
              // some devices don't support 'power-on'
            }
          }
          else {
            try {
              await api.deviceCommand(device.slug, 'power-off')
            }
            catch (e) {
              // some devices don't support 'power-off'
            }
          }
          if (fix.Input) {
            await api.deviceCommand(device.slug, 'input' + fix.Input.toLowerCase().replace(/ /g, ''))
          }
        }
        catch (e) {
          console.log('fixit exception', e)
        }
      }
      resolve()
    })
  }

  renderFixit() {
    const currentActivity = this.state.currentActivity,
          devices         = this.state.devices,
          activities      = this.state.activities,
          activity        = activities[currentActivity],
          fixit           = activity.fixit

    return (
      <NavDropdown title="Fixit" id="fixit-dropdown">
        {Object.keys(fixit).map((key) => {
          const dkey     = 'harmony-' + this.device + '-fixit-' + key,
                fix      = fixit[key],
                device   = devices[key],
                label    = device.label + (fix.Power === 'On' ? 'Power On' : '') + (fix.Input ? 'Input ' + fix.Input : ''),
                disabled = Boolean(this.state.startingActivity !== this.state.currentActivity)

          return (
            <MenuItem
              key={dkey}
              onClick={this.chooseDevice}
              data-key={key}
              disabled={disabled}
            >
              {label}
            </MenuItem>
          )
        })}
      </NavDropdown>
    )
  }

  renderControls() {
    const currentActivity = this.state.currentActivity,
          activities      = this.state.activities,
          activity        = activities[currentActivity]

    return (
      <RemoteControl
        topic={this.set_topic}
        renderButton={this.renderButton}
        renderMiniButton={this.renderMiniButton}
        controlGroup={activity.controlGroup}
      />
    )
  }

  /**
     * Render a Navbar for Hub control
     * @returns {XML} JSX for the Navbar
     */
  renderNavbar() {
    const currentActivity = this.state.currentActivity,
          activities      = this.state.activities,
          activity        = activities[currentActivity],
          label           = activity.label

    if (currentActivity === '-1') {
      return null
    }

    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <span>{label}</span>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {this.renderActivities()}
            {this.renderDevices()}
          </Nav>
          <Nav>
            <NavItem
              onClick={this.fixit}
            >
                            Fixit
            </NavItem>
            <NavItem >
              <Button
                bsSize="xsmall"
                bsStyle="danger"
                onClick={this.chooseActivity}
                data-key={'-1'}
              >
                <Glyphicon glyph="off"/> Off
              </Button>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  renderOff() {
    const activities       = this.state.activities,
          activitiesSorted = Object.keys(activities).sort((a, b) => activities[a].activityOrder > activities[b].activityOrder)

    return (
      <JumboTron>
        <h1>No Activity Running</h1>
        <p>There is no activity currently running. Which one would you like to start?</p>
        {activitiesSorted.map((key) => {
          const dkey     = 'harmony-start-' + this.device + '-' + key,
                activity = activities[key],
                label    = activity.label

          if (~label.toLowerCase().indexOf('mood') || label === 'PowerOff') {
            return null
          }
          return (
            <Button
              key={dkey}
              data-key={key}
              style={{width: 130, height: 130}}
              onClick={this.chooseActivity}
            >
              {activity.label}
            </Button>
          )
        })}
      </JumboTron>
    )
  }


  renderActivityStarting() {
    const state = this.state

    return (
      <JumboTron>
        <h1>Starting {state.activities[state.startingActivity].label}</h1>
        <div style={{textAlign: 'center'}}>
          <Loader
            color="black"
            style={{marginTop: 1000, width: '100%', height: '100%'}}
          />
        </div>
      </JumboTron>
    )
  }

  render() {
    try {
      const state = this.state

      if (!state || !state.devices || !state.activities || !state.activityDevices) {
        return (
          <h1>Connecting...</h1>
        )
      }
      if (this.isActivityStarting()) {
        return this.renderActivityStarting()
      }
      if (state.currentActivity === '-1') {
        return this.renderOff()
      }

      const dialog = this.state.currentDevice ?
        <DeviceDialog
          device={this.state.currentDevice}
          hub={this.hub}
          api={this.api}
          onClose={() => {
            this.setState({currentDevice: null})
          }}
        /> : null

      return (
        <div>
          {this.renderNavbar()}
          {this.renderControls()}
          {dialog}
        </div>
      )
    }
    catch (e) {
      console.log('Harmony render exception', e.stack)
      return null
    }
  }

  // JSON parse function actions
  // map control group from array to object
  fixControlGroup(group) {
    if (Array.isArray(group)) {
      const controlGroup = {}

      group.forEach((control) => {
        const funcs = {}
        control.function.forEach((func) => {
          func.action      = JSON.parse(func.action)
          funcs[func.name] = func
        })
        control.function           = funcs
        controlGroup[control.name] = control
      })
      return controlGroup
    }
    else {
      return group
    }
  }

  devicesInControlGroup(controlGroup, devices) {
    const map = {}


    Object.keys(controlGroup).forEach((key) => {
      const control = controlGroup[key]

      Object.keys(control.function).forEach((key) => {
        const func = control.function[key]

        map[func.action.deviceId] = devices[func.action.deviceId]
      })
    })
    return map
  }

  onStateChange(topic, newState) {
    const newValue = {},
          key      = topic.substr(this.status_topic_length)

    newValue[key] = newState
    console.log('statechange', newValue)
    this.setState(newValue)

    try {
      const state = this.state
      if (state) {
        if (state.currentActivity && state.activities) {
          const
                currentActivity = state.currentActivity,
                activities      = state.activities,
                activity        = activities[currentActivity],
                devices         = state.devices

          if (currentActivity !== -1) {
            activity.controlGroup = this.fixControlGroup(activity.controlGroup)
            state.activityDevices = this.devicesInControlGroup(activity.controlGroup, devices)
            this.setState(state)
          }

          Object.keys(devices).forEach((key) => {
            const device        = devices[key]
            device.controlGroup = this.fixControlGroup(device.controlGroup)
          })
        }
      }
    }
    catch (e) {
      // state may not be complete yet, so the above logic is expected to throw errors sometimes
    }
  }

  componentDidMount() {
    const status_topic = this.status_topic

    topics.forEach((topic) => {
      MQTT.subscribe(status_topic + topic, this.onStateChange)
    })
  }

  componentWillUnmount() {
    const status_topic = this.status_topic

    topics.forEach((topic) => {
      MQTT.unsubscribe(status_topic + topic, this.onStateChange)
    })
  }
}
