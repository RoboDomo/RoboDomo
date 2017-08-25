import React from 'react'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Subheader from 'material-ui/Subheader'

import BusyDialog from '../components/BusyDialog'
import DeviceDialog from '../components/DeviceDialog'

import MQTT from '../../lib/MQTT'

const model = {}

class Button extends React.Component {
    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    render() {
        return (
            <FlatButton
                label={this.props.label}
                onClick={this.onClick}
            />
        )
    }

    onClick() {
        this.props.onClick(this.props.data)
    }
}

const types = [
    {primary: 'Weather', secondary: 'Collect weather data by zip'},
    {primary: 'TV Guide', secondary: 'TV Guide for your provider'},
    {primary: 'Switch', secondary: 'SmartThings Device'},
    {primary: 'Dimmer', secondary: 'SmartThings Device'},
    {primary: 'Fan', secondary: 'SmartThings Device'},
    {primary: 'Motion Sensor', secondary: 'SmartThings Device'},
    {primary: 'Door/Window Sensor', secondary: 'SmartThings Device'},
    {primary: 'Harmony Hub', secondary: 'Theater Remote Control'},
    {primary: 'TiVo', secondary: 'TiVo DVR/Mini'},
    {primary: 'LG TV', secondary: 'Television'},
    {primary: 'Bravia TV', secondary: 'Sony TV'},
    {primary: 'Denon AVR', secondary: 'A/V Receiver'},
    {primary: 'Nest Thermostat', secondary: 'Smart Thermostat'},
    {primary: 'Autelis', secondary: 'Pool/Spa Controller'},
]

export default class Devices extends React.Component {
    constructor(props) {
        super(props)
        this.state = {value: 1, model: Object.assign({}, model)}

        this.onPopoverTap       = this.onPopoverTap.bind(this)
        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.handleItemTap      = this.handleItemTap.bind(this)
        this.onBeginScan        = this.onBeginScan.bind(this)
        this.onEndScan          = this.onEndScan.bind(this)
        this.onMessage          = this.onMessage.bind(this)
    }

    onMessage(topic, message) {
        const model             = this.state.model,
              [t, name, device] = topic.split('/')

        const record = model[name] || {name: name, topic: t, devices: [], type: device}
        if (record.devices.indexOf(device) === -1) {
            record.devices.push(device)
        }
        model[name] = record
        this.setState({model: model})
    }

    onBeginScan() {
        this.setState({
            popover:    false,
            busy:       true,
            deviceType: null
        })
        MQTT.subscribe('smartthings/#')
        MQTT.on('message', this.onMessage)
        setTimeout(() => {
            MQTT.removeListener('message', this.onMessage)
            MQTT.unsubscribe('smartthings/#')
            this.setState({
                popover:    false,
                busy:       false,
                deviceType: null
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

    handleRequestClose(e) {
        console.log('close')
        this.setState({
            popover:    false,
            busy:       false,
            deviceType: null
        })
    }

    handleItemTap(e, menuItem) {
        console.log('handleItemTap', menuItem.key)
        this.setState({
            popover:    false,
            deviceType: menuItem.key,
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
                    title={`Add ${type}`}
                    onCancel={this.handleRequestClose}
                />
            )
        }
        return null
    }

    renderDropDown() {
        let value = 1
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
                            // if (type.secondary) {
                            //     text = <span>{type.primary} <small>({type.secondary})</small></span>
                            // }
                            return <MenuItem
                                key={text}
                                value={value++}
                                primaryText={text}
                                // secondaryText={type.secondary}
                            />
                        })}
                    </Menu>
                </Popover>
            </div>
        )
    }

    renderTable() {
        const recs    = Object.values(this.state.model),
              records = recs.sort((a, b) => {
                  return a.name.localeCompare(b.name)
              })
        return (
            <Table
                height="450px"
                fixedHeader={true}
            >
                <TableHeader
                >
                    <TableRow>
                        <TableHeaderColumn>
                            Topic
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            Name
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            Type
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={true}
                >
                    {records.map((record) => {
                        // figure out type
                        if (record.type !== 'fan') {
                            if (~record.devices.indexOf('switch')) {
                                if (~record.devices.indexOf('level')) {
                                    record.type = 'dimmer'
                                }
                                else {
                                    record.type = 'switch'
                                }
                            }
                            else if (~record.devices.indexOf('button')) {
                                if (~record.devices.indexOf('motion')) {
                                    record.type = 'doorbell'
                                }
                                else {
                                    record.type = 'button'
                                }
                            }
                            else if (~record.devices.indexOf('contact')) {
                                if (~record.devices.indexOf('temperature')) {
                                    record.type = 'multi sensor'
                                }
                                else {
                                    record.type = 'door sensor'
                                }
                            }
                            else {
                                record.type = record.devices.join(',')
                            }
                        }

                        const type = (
                            <Button
                                label={record.type}
                                data={record.name}
                                onClick={(name) => {
                                    console.dir(this)

                                    const model = this.state.model,
                                          type  = model[name].type.toUpperCase()

                                    if (type === 'DIMMER') {
                                        model[name].type = 'fan'
                                    }
                                    else if (type === 'FAN') {
                                        model[name].type = 'DIMMER'
                                    }
                                    this.setState({model: model})
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
