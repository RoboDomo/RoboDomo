import Config from '../../../Config'

import React from 'react'

import Tile from './Tile'

const dayNames = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]

export default class ClockTile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: ''
    }
  }

  render() {
    const tileSize = Config.screenSize === 'small' ? 1 : 2
    return (
      <Tile
        //backgroundColor="white"
        //color="black"
        width={tileSize}
        height={tileSize}
      >
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: 37*tileSize, width: '100%'}}>
            {this.state.time}
            <span style={{fontSize: 20*tileSize}}>{this.state.seconds}</span>
          </div>
          <div style={{fontSize: 20}}>{this.state.day}</div>
          <div style={{fontSize: 20}}>{this.state.date}</div>
        </div>
      </Tile>
    )
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      const d       = new Date(),
            hr      = d.getHours(),
            hour    = hr > 12 ? hr - 12 : hr,
            min     = String(d.getMinutes()),
            minutes = min.length === 1 ? ('0' + min) : min,
            sec     = String(d.getSeconds()),
            seconds = sec.length === 1 ? ('0' + sec) : sec

      this.setState({
        time:    (hour || '12') + ':' + minutes,
        seconds: seconds,
        date:    d.toLocaleDateString(),
        day:     dayNames[d.getDay()],
      })
    })
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
