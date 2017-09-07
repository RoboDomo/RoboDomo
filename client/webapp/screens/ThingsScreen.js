import Config from '../../Config'

import React from 'react'

import Screen from '../components/Screen'
import SmartThings from '../controls/SmartThings'

export default class ThingsScreen extends React.Component {
  render() {
    const roomsMap = {
      All: []
    }

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
    Config.smartthings.things.forEach((thing) => {
      thing.rooms.forEach((room) => {
        if (room !== '*') {
          return
        }
        for (const r in roomsMap) {
          roomsMap[r].push(thing)
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

    return (
      <Screen
        header="SmartThings"
        tabState="smartthings"
      >
        {rooms.map((room, ndx) => {
          const key = 'things-room-' + room.name + 'ndx'
          return (
            <SmartThings
              key={key}
              eventKey={String(ndx)}
              room={room}
              title={room.name}
            />
          )
        })}
      </Screen>
    )
  }
}
