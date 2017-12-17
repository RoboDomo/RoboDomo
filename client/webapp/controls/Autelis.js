import Config from '../../Config'

import React from 'react'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Panel from 'react-bootstrap/lib/Panel'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import Button from 'react-bootstrap/lib/Button'
import ToggleButton from 'react-bootstrap/lib/ToggleButton'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup'

import Form from 'react-bootstrap/lib/Form'
import ToggleField from '../components/form/ToggleField'
import NumberField from '../components/form/NumberField'

import MQTT from '../../lib/MQTT'

import AutelisPanel from './AutelisPanel'
const poolControlHeader = <h1>Pool Controls</h1>,
      spaControlHeader  = <h1>Spa Controls</h1>

const topics = [
  'pump', 'spa', 'spaTemp', 'poolTemp', 'poolSetpoint', 'spaSetpoint', 'cleaner', 'waterfall',
  'poolLight', 'spaLight', 'jet', 'blower', 'spaHeat', 'poolHeat', 'solarHeat', 'solarTemp'
]

export default class Autelis extends React.Component {
  constructor(props) {
    super()
    this.device              = props.controller.device
    this.controller          = props.controller
    this.deviceMap           = props.deviceMap
    this.state               = {
      selected: localStorage.getItem('autelis-radio') || 'pool'
    }
    this.onStateChange       = this.onStateChange.bind(this)
    this.status_topic        = Config.mqtt.autelis + '/status/'
    this.status_topic_length = this.status_topic.length
    this.set_topic           = Config.mqtt.autelis + '/set/'
  }

  renderPoolTemperature() {
    const state = this.state
    if (!state || state.pump !== 'on') {
      return <div>Pool pump is off</div>
    }
    return <div>Pool Temperature {state.poolTemp}&deg; F</div>
  }

  renderSolarTemperature() {
    const state = this.state
    return <div>Solar Temperature {state.solarTemp}&deg; F</div>
  }

  renderSpaTemperature() {
    const state = this.state

    if (!state || state.spa !== 'on') {
      return <div>Spa is off</div>
    }
    else if (state.spaTemp === 0) {
      return <div>Spa is warming up</div>
    }
    return <div>Spa Temperature {state.spaTemp}&deg; F</div>
  }

  renderPoolControls() {
    const state = this.state

    return (
      <Panel
        style={{width: '100%'}}
        header={poolControlHeader}
        bsStyle={Config.ui.subPanelType}
      >
        <div style={{fontSize: 25, textAlign: 'center', marginBottom: 1}}>
          {this.renderPoolTemperature()}
        </div>
        <div style={{fontSize: 15, textAlign: 'center', marginBottom: 20}}>
          {this.renderSolarTemperature()}
        </div>
        <Form horizontal>
          <ToggleField
            label="Pump"
            name="pump"
            toggled={state.pump === 'on'}
            onToggle={this.toggleHandler.bind(this)}
          />
          <ToggleField
            label="Cleaner"
            name="cleaner"
            toggled={state.cleaner === 'on'}
            onToggle={this.toggleHandler.bind(this)}
          />
          <ToggleField
            label="Waterfall"
            name="waterfall"
            toggled={state.waterfall === 'on'}
            onToggle={this.toggleHandler.bind(this)}
          />
          <ToggleField
            label="Pool Light"
            name="poolLight"
            toggled={state.poolLight === 'on'}
            onToggle={this.toggleHandler.bind(this)}
          />
          <ToggleField
            label="Pool Heat"
            name="poolHeat"
            toggled={['on', 'enabled'].indexOf(state.poolHeat) !== -1}
            onToggle={this.togglePoolHeat.bind(this)}
          />
          <ToggleField
            label="Solar Heat"
            name="solarHeat"
            toggled={['on', 'enabled'].indexOf(state.solarHeat) !== -1}
            onToggle={this.toggleSolarHeat.bind(this)}
          />
          <NumberField
            label="Pool Setpoint"
            name="poolSetpoint"
            value={state.poolSetpoint}
            onValueChange={this.setPoolSetpoint.bind(this)}
          />
        </Form>
      </Panel>
    )
  }

  renderSpaControls() {
    const state = this.state

    return(
      <Panel
        style={{width: '100%'}}
        header={spaControlHeader}
        bsStyle={Config.ui.subPanelType}
      >
        <div style={{fontSize: 25, textAlign: 'center', marginBottom: 20}}>
          {this.renderSpaTemperature()}
        </div>
        <Form horizontal>
          <ToggleField
            label="Spa"
            name="spa"
            toggled={state.spa === 'on'}
            onToggle={this.toggleHandler.bind(this)}
          />
          <ToggleField
            label="Spa Light"
            name="spaLight"
            toggled={state.spaLight === 'on'}
            onToggle={this.toggleHandler.bind(this)}
          />
          <ToggleField
            label="Jets"
            name="jet"
            toggled={state.jet === 'on'}
            onToggle={this.toggleHandler.bind(this)}
          />
          <ToggleField
            label="Air Blower"
            name="blower"
            toggled={state.blower === 'on'}
            onToggle={this.toggleHandler.bind(this)}
          />
          <ToggleField
            label={'Spa Heat'}
            name="spaHeat"
            toggled={['on', 'enabled'].indexOf(state.spaHeat) !== -1}
            onToggle={this.toggleSpaHeat.bind(this)}
          />
          <NumberField
            label="Spa Setpoint"
            name="spaSetpoint"
            value={state.spaSetpoint}
            onValueChange={this.setSpaSetpoint.bind(this)}
          />
        </Form>
      </Panel>
    ) 
  }

  renderAutelisPanel() {
    return (
      <Panel
        style={{width: '100%', margin: 0, padding: 0}}
        header="Control Panel"
        bsStyle={Config.ui.subPanelType}
      >
        <div style={{textAlign: 'center'}}>
          <AutelisPanel/>
        </div>
      </Panel>
    )
  }

  renderSelector() {
    return (
      <ButtonToolbar>
        <ToggleButtonGroup 
          type="radio" 
          name="selector" 
          defaultValue={this.state.selected} 
          justified
          onChange={(value) => {
            localStorage.setItem('autelis-radio', value)
            this.setState({
              selected: value
            })
          }}
        >
          <ToggleButton value={'pool'}>
            {'Pool Control'}
          </ToggleButton>
          <ToggleButton value={'spa'}>
            {'Spa Control'}
          </ToggleButton>
          <ToggleButton value={'panel'}>
            {'Control Panel'}
          </ToggleButton>
        </ToggleButtonGroup>
      </ButtonToolbar>
    )
  }

  renderSelected() {
    switch (this.state.selected) {
      case 'panel':
        return this.renderAutelisPanel()
      case 'spa':
        return this.renderSpaControls()
      default:
        return this.renderPoolControls()
    }
  }
    
  render() {
    try {
      const state = this.state

      if (!state || !state.poolSetpoint || !state.spaSetpoint) {
        return (
          <h1>Connecting...</h1>
        )
      }

      return (
        <div>
          <Row style={{marginTop: 6}}>
            <Col sm={12} style={{padding: 5}}>
              {this.renderSelector()}
            </Col>
          </Row>
          <Row style={{marginTop: 6}}>
            <Col sm={3} style={{padding: 5}} >
              <div/>
            </Col>
            <Col sm={6} style={{padding: 5}}>
              {this.renderSelected()}
            </Col>
            <Col sm={3} style={{padding: 5}} >
              <div/>
            </Col>
          </Row>
        </div>
      )

      //        <Row style={{marginTop: 20}}>
      //          <Col sm={4} style={{padding: 5}}>
      //            {this.renderPoolControls()}
      //          </Col>
      //          <Col sm={4} style={{padding: 5}}>
      //            {this.renderSpaControls()}
      //          </Col>
      //          <Col sm={4}>
      //            {this.renderAutelisPanel()}
      //          </Col>
      //        </Row>
      //      )
    }
    catch (e) {
      return null
    }
  }

  onStateChange(topic, newState) {
    console.log('statechange', topic, newState)
    const newValue = {},
          what     = topic.substr(this.status_topic_length),
          key      = this.deviceMap.backward[what] || what


    newValue[key] = newState
    console.log('statechange', newValue)
    this.setState(newValue)
  }

  componentDidMount() {
    const status_topic = this.status_topic,
          deviceMap    = this.deviceMap.forward

    topics.forEach((topic) => {
      const device = deviceMap[topic] || topic
      MQTT.subscribe(status_topic + device, this.onStateChange)
    })
  }

  componentWillUnmount() {
    const status_topic = Config.mqtt.autelis + '/status/',
          deviceMap    = this.deviceMap.forward

    topics.forEach((topic) => {
      const device = deviceMap[topic] || topic
      MQTT.unsubscribe(status_topic + device, this.onStateChange)
    })
  }

  control(what, state) {
    const deviceMap = this.deviceMap.forward,
          key = deviceMap[what] || what
    if (typeof state !== 'number') {
      state = state ? 'on' : 'off'
    }
    MQTT.publish(this.set_topic + key, state)
    // this.api.set(what, state)

    const newState = {}
    newState[what] = state
    this.setState(newState)
  }

  toggleHandler(name, state) {
    this.control(name, state)
  }

  toggleSpaHeat(name, state) {
    this.control('spaHeat', state)
  }

  setSpaSetpoint(temp) {
    const state = this.state
    if (state && state.spaSetpoint !== temp) {
      this.control('spaSetpoint', temp)
    }
  }

  togglePoolHeat(name, state) {
    this.control('poolHeat', state)
  }

  toggleSolarHeat(name, state) {
    this.control('solarHeat', state)
  }

  setPoolSetpoint(temp) {
    const state = this.state

    if (state && state.poolSetpoint !== temp) {
      this.control('poolSetpoint', temp)
    }
  }
}
