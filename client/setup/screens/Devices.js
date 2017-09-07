import React from 'react'
import PropTypes from 'prop-types'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'

import {
  Toolbar, 
  ToolbarGroup, 
  //ToolbarSeparator, 
  //ToolbarTitle
} from 'material-ui/Toolbar'


import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Subheader from 'material-ui/Subheader'

import DeleteIcon from 'material-ui/svg-icons/action/delete'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'

import BusyDialog from '../components/BusyDialog'
import DeviceDialog from '../components/DeviceDialog'

import MQTT from '../../lib/MQTT'

///\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\/\\
///\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\/\\
///\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\/\\

class ToggleButton extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  render() {
    return (
      <FlatButton
        primary
        label={this.props.label}
        onClick={this.onClick}
      />
    )
  }

  onClick() {
    this.props.onClick(this.props.data)
  }
}
ToggleButton.propTypes = {
  label:   PropTypes.node,
  data:    PropTypes.string,
  onClick: PropTypes.func,
}

///\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\/\\
///\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\/\\
///\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\/\\

class ActionButton extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  render() {
    const color = this.props.color,
          Icon = this.props.icon

    return (
      <IconButton 
        iconStyle={{color: color}}
        onClick={this.onClick}
      >
        {Icon}
      </IconButton>
    )
  }

  onClick() {
    this.props.onClick(this.props.data)
  }
}
ActionButton.propTypes = {
  icon:    PropTypes.node,
  color:   PropTypes.string,
  data:    PropTypes.string,
  onClick: PropTypes.func,
}

///\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\/\\
///\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\/\\
///\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\/\\
//
const types = [
  {primary: 'Weather Location', secondary: 'Collect weather data by zip'},
  {primary: 'TV Guide', secondary: 'TV Guide for your provider'},
  {primary: 'Harmony Hub', secondary: 'Theater Remote Control'},
  {primary: 'TiVo', secondary: 'TiVo DVR/Mini'},
  {primary: 'LG TV', secondary: 'Television'},
  {primary: 'Bravia TV', secondary: 'Sony TV'},
  {primary: 'Denon AVR', secondary: 'A/V Receiver'},
  {primary: 'Nest Thermostat', secondary: 'Smart Thermostat'},
  {primary: 'Autelis Pool Controller', secondary: 'Pool/Spa Controller', topic: 'autelis/status', name: false},
]

export default class Devices extends React.Component {
  state = {}
  constructor(props) {
    super(props)

    this.store = props.store

    this.onPopoverTap       = this.onPopoverTap.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.handleItemTap      = this.handleItemTap.bind(this)
    this.onBeginScan        = this.onBeginScan.bind(this)
    this.onEndScan          = this.onEndScan.bind(this)
    this.onMessage          = this.onMessage.bind(this)
  }

  onMessage(topic, message) {
    console.log('topic', topic, 'message', message)
    const [t, name, device] = topic.split('/')

    this.store.dispatch({
      slice:  'smartthings',
      type:   'ADD',
      topic:  t,
      name:   name,
      device: device,
      status: message
    })
  }

  onBeginScan() {
    this.setState({
      popover:       false,
      busy:          true,
      deviceType:    null,
      originalCount: Object.keys(this.store.getState().smartthings || {}).length
    })

    MQTT.subscribe('smartthings/#')
    MQTT.on('message', this.onMessage)
    setTimeout(() => {
      MQTT.removeListener('message', this.onMessage)
      MQTT.unsubscribe('smartthings/#')
      this.setState({
        popover:    false,
        busy:       false,
        deviceType: null,
        topic:      null,
        name:       null
      })
    }, 5000)
  }

  onEndScan() {
    this.setState({
      popover:    false,
      busy:       true,
      deviceType: null
    })
  }

  onPopoverTap(e) {
    this.setState({
      anchorEl: e.currentTarget,
      popover:  true
    })
  }

  handleRequestClose() {
    this.setState({
      popover:    false,
      busy:       false,
      deviceType: null,
      topic:      null,
      name:       null
    })
  }

  handleItemTap(e, menuItem) {
    this.setState({
      popover:     false,
      deviceType:  menuItem.key,
      deviceValue: menuItem.props.value
    })
  }

  renderDialog() {
    const busy = this.state.busy,
          type = this.state.deviceType

    if (busy) {
      return (
        <BusyDialog
          title="Scanning"
          prompt={this.state.found}
          onCancel={this.handleRequestClose}
        />
      )
    }
    if (type) {
      return (
        <DeviceDialog
          title={'Add ' + type}
          onCancel={this.handleRequestClose}
          onConfirm={this.handleRequestClose}
          type={type}
          topic={this.state.deviceValue.topic}
          name={this.state.deviceValue.name || ''}
          store={this.store}
        />
      )
    }
    return null
  }

  renderDropDown() {
    return (
      <div>
        <RaisedButton
          onClick={this.onPopoverTap}
          label="Add Device"
        />
        <Popover
          open={this.state.popover}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu
            onItemTouchTap={this.handleItemTap}
          >
            <Subheader>Choose a device type to add:</Subheader>
            {types.map((type) => {
              let text = type.primary
              return (
                <MenuItem
                  key={text}
                  value={type}
                  primaryText={text}
                />
              )
            })}
          </Menu>
        </Popover>
      </div>
    )
  }

  renderTable() {
    const model   = (this.store.getState().devices || {}),
          recs    = Object.values(model || []),
          records = recs.sort((a, b) => {
            return a.name.localeCompare(b.name)
          })
    
    return (
      <Table
        height="450px"
        selectable={false}
        fixedHeader
      >
        <TableHeader 
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>
              {'Topic'}
            </TableHeaderColumn>
            <TableHeaderColumn>
              {'Name'}
            </TableHeaderColumn>
            <TableHeaderColumn>
              {'Type'}
            </TableHeaderColumn>
            <TableHeaderColumn>
              {'Current State'}
            </TableHeaderColumn>
            <TableHeaderColumn>
              {'Actions'}
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {records.map((record) => {
            const ucType = record.type.toUpperCase(),
                  label  = (ucType === 'DIMMER' || ucType === 'FAN') ? (
                    <span style={{verticalAlign: 'middle'}}>
                                &laquo; {record.type} &raquo;
                    </span>) : ucType,
                  type   = (
                    <ToggleButton
                      label={label}
                      data={record.name}
                      onClick={(name) => {
                        this.store.dispatch({
                          slice: 'smartthings',
                          type:  'TOGGLE_DIMMER_FAN',
                          name:  name
                        })
                      }}
                    />
                  )

            return (
              <TableRow key={record.name}>
                <TableRowColumn>
                  {record.topic}
                </TableRowColumn>
                <TableRowColumn>
                  {record.name}
                </TableRowColumn>
                <TableRowColumn>
                  {type}
                </TableRowColumn>
                <TableRowColumn>
                  {Object.keys(record.status).sort().map((s) => s + ' ' + record.status[s]).join('/')}
                </TableRowColumn>
                <TableRowColumn>
                  <ActionButton 
                    color="red"
                    data={record.topic + '/' + record.name}
                    icon={<DeleteIcon/>}
                    onClick={(data) => {
                      console.log('data', data)
                    }}
                  />
                  <ActionButton 
                    color="green"
                    data={record.name}
                    icon={<EditIcon/>}
                    onClick={(data) => {
                      console.log('data', data)
                    }}
                  />
                </TableRowColumn>
              </TableRow>
            )
          })}

        </TableBody>
      </Table>
    )
  }

  render() {
    return (
      <div
        style={{padding: 20}}
      >
        {this.renderDialog()}
        <h1>
                    Devices
        </h1>
        <p>You can toggle device Type between DIMMER and FAN. Type column is toggle buttons.</p>
        <Toolbar>
          <ToolbarGroup>
            {this.renderDropDown()}
            <RaisedButton
              label="Scan SmartThings"
              onClick={this.onBeginScan}
            />
          </ToolbarGroup>
        </Toolbar>
        {this.renderTable()}
      </div>
    )
  }
}

Devices.propTypes = {
  label: PropTypes.string,
  data:  PropTypes.string,
  store: PropTypes.object,
}
