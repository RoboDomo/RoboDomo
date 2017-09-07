import Config from '../Config'

import React, {Component} from 'react'
//import PropTypes from 'prop-types'

import {Tabs, Tab} from 'material-ui-scrollable-tabs/Tabs'
import {List, ListItem} from 'material-ui/List'

import Switch from '../controls/Switch'
import Dimmer from '../controls/Dimmer'
import Fan from '../controls/Fan'
import Presence from '../controls/Presence'
import Motion from '../controls/Motion'
import Temperature from '../controls/Temperature'
import Contact from '../controls/Contact'

var flattenRooms = () => {
  const roomsMap = {
    All: []
  }

  // add all the * room things to All
  // add all the non * things to [room]
  Config.smartthings.things.forEach((thing) => {
    roomsMap.All.push(thing)
    thing.rooms.forEach((room) => {
      if (room === '*') {
        return
      }
      roomsMap[room] = roomsMap[room] || []
      roomsMap[room].push(thing)
    })
  })

  // add all the * room things to each room
  Config.smartthings.things.forEach((thing) => {
    thing.rooms.forEach((room) => {
      if (room !== '*') {
        return
      }
      for (const r in roomsMap) {
        if (r !== 'All') {
          roomsMap[r].push(thing)
        }
      }
    })
  })

  // flatten rooms
  const rooms = []
  for (const name in roomsMap) {
    rooms.push({
      name:   name,
      things: roomsMap[name]
    })
  }
  return rooms
}

export default class SmartThings extends Component {
  state = {
    activeTab: 0,
    rooms:     flattenRooms()
  }
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(value) {
    this.setState({ activeTab: value })
  }

  renderRoom(room) {
    return (
      <List>
        {room.things.map((thing, ndx) => {
          switch (thing.type) {
            case 'switch':
              return (
                <Switch
                  key={ndx}
                  thing={thing}
                />
              )
            case 'fan':
              return (
                <Fan
                  key={ndx}
                  thing={thing}
                />
              )
            case 'dimmer':
              return (
                <Dimmer
                  key={ndx}
                  thing={thing}
                />
              )
            case 'presence':
              return (
                <Presence
                  key={ndx}
                  thing={thing}
                />
              )
            case 'motion':
              return (
                <Motion
                  key={ndx}
                  thing={thing}
                />
              )
            case 'temperature':
              return (
                <Temperature
                  key={ndx}
                  thing={thing}
                />
              )
            case 'contact':
              return (
                <Contact
                  key={ndx}
                  thing={thing}
                />
              )
            default:
              return (
                <ListItem
                  key={ndx}
                  primaryText={thing.name + ' ' + thing.type}
                >
                  {thing.rooms.join('/')}
                </ListItem>
              )
          }
        })}
      </List>
    )
  }

  render() {
    const rooms = this.state.rooms

    return (
      <div>
        <Tabs
          tabType="scrollable-buttons"
          value={this.state.value}
          onChange={this.handleChange}
        >
          {rooms.map((room, ndx) => {
            const key = 'smartthings-room-' + room.name + '-' + ndx
            return (
              <Tab
                label={room.name}
                key={key}
                value={ndx}
                onChange={this.handleChange}
              >
                <div style={{padding: 15}}>
                  {this.renderRoom(room)}
                </div>
              </Tab>
            )
          })}
        </Tabs>
      </div>
    )
  }
}

SmartThings.propTypes = {}

