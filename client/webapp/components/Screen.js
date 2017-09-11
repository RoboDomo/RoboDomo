import Config from '../../Config'

import React from 'react'
import Panel from 'react-bootstrap/lib/Panel'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

import SideNav from '../components/SideNav'

import MQTT from '../../lib/MQTT'

// TODO: show pool/spa info (if on)
class Clock extends React.Component {
  constructor() {
    super()

    this.nest = Config.nest.thermostats[0].device
    this.nest_status_topic        = Config.mqtt.nest + '/' + this.nest + '/status/'
    this.nest_status_topic_length = this.nest_status_topic.length
    this.nest_set_topic           = this.nest_status_topic.replace('status', 'set')

    this.location  = Config.weather.locations[0]
    this.weather_status_topic = Config.mqtt.weather + '/' + this.location.device + '/status/'
    this.weather_status_topic_length = this.weather_status_topic.length

    this.onWeatherStateChange        = ::this.onWeatherStateChange
    this.onNestStateChange = ::this.onNestStateChange
  }

  render() {
    if (!this.state) {
      return null
    }
    const now = this.state.now,
          ambient_temperature_f = this.state.ambient_temperature_f

    if (!now || !ambient_temperature_f) {
      return null
    }

    return (
      <div style={{marginBottom: 10, textAlign: 'center'}}>
        <div
          style={{
            textAlign:    'center',
            fontSize:     24,
            marginBottom: 0
          }}
        >
          {new Date().toLocaleTimeString()}
        </div>
        <div>
          <img 
            style={{
              verticalAlign: 'middle',
              width:         32,
              height:        32
            }} 
            src={'/img/Weather/icons/black/' + now.icon + '.svg'}
          />
          <div style={{display: 'inline', paddingTop: 0}}>{now.current_temperature}&deg; F</div>
        </div>
        <div style={{display: 'block', paddingTop: 0}}>Inside: {ambient_temperature_f}&deg; F</div>
      </div>
    )
  }

  onWeatherStateChange(topic, newState) {
    const newVal = {}

    newVal[topic.substr(this.weather_status_topic_length)] = newState
    this.setState(newVal)
  }

  onNestStateChange(topic, newState) {
    const newVal = {}

    newVal[topic.substr(this.nest_status_topic_length)] = newState
    this.setState(newVal)
  }

  componentDidMount() {
    MQTT.subscribe(this.weather_status_topic + 'now', this.onWeatherStateChange)
    MQTT.subscribe(this.nest_status_topic + 'ambient_temperature_f', this.onNestStateChange)

    this.timer = setInterval(() => {
      this.setState({foo: 1})
    }, 1000)
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.weather_status_topic + 'now', this.onWeatherStateChange)
    MQTT.unsubscribe(this.nest_status_topic + 'ambient_temperature_f', this.onNestStateChange)
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

export default class Screen extends React.Component {
  constructor(props) {
    super(props)

    const tabState = props.tabState

    if (!tabState) {
      throw new Error('Screen requires tabState prop')
    }
    this.state     = {
      children:  Array.isArray(props.children) ? props.children : [props.children],
      tabState:  tabState,
      activeTab: localStorage.getItem(tabState + 'TabState') || '0'
    }
    this.changeTab = this.changeTab.bind(this)
  }

  render() {
    if (Config.screenSize === 'small') {
      return (
        <Grid fluid style={{height: '100%', padding: '0 5 50 5'}}>
          <Row style={{
            marginTop:    0,
            paddingRight: 4,
            paddingLeft:  4,
            height:       '100%',
            overflow:     'hidden'
          }}
          >
            <Col sm={12} style={{height: '100%', overflow: 'auto'}}>
              <h1>{this.props.header}</h1>
              <Tabs
                bsStyle="pills"
                defaultActiveKey={this.state.activeTab}
                id={this.state.tabState + '-tabs'}
                onSelect={this.changeTab}
                mountOnEnter
                unmountOnExit
              >
                {this.state.children.map((child, ndx) => {
                  return (
                    <Tab
                      key={child.key}
                      eventKey={String(ndx)}
                      title={child.props.title}
                    >
                      {child}
                    </Tab>
                  )
                })}
              </Tabs>
            </Col>
          </Row>
        </Grid>
      )
    }
    return (
      <Grid fluid style={{height: '100%', paddingBottom: 50}}>
        <Row style={{paddingTop: 10, height: '100%', overflow: 'hidden'}}>
          <Col sm={2}>
            <Clock/>
            <SideNav/>
          </Col>
          <Col sm={10} style={{height: '100%', overflowY: 'auto', overflowX: 'hidden'}}>
            <Panel
              header={this.props.header}
              bsStyle={Config.ui.panelType}
            >
              <Tabs
                bsStyle="pills"
                defaultActiveKey={this.state.activeTab}
                id={this.state.tabState + '-tabs'}
                onSelect={this.changeTab}
                mountOnEnter
                unmountOnExit
              >
                {this.state.children.map((child, ndx) => {
                  return (
                    <Tab
                      key={child.key}
                      eventKey={String(ndx)}
                      title={child.props.title}
                    >
                      {child}
                    </Tab>
                  )
                })}
              </Tabs>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }

  changeTab(eventKey) {
    localStorage.setItem(this.state.tabState + 'TabState', eventKey)
    this.setState({activeTab: eventKey})
  }
}
