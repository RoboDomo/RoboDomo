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

  renderStockPrice() {
    const state = this.state
    if (!state.symbol) {
      return null
    }
    if (state.change >= 0) {
      return (
        <div style={{fontSize: 15, color: 'green'}}>{state.symbol + ' ' + state.price + ' ' + state.pctChange + '%'}</div>
      )
    }
    return (
      <div style={{fontSize: 15, color: 'red'}}>{state.symbol + ' ' + state.price + ' ' + state.pctChange + '%'}</div>
    )
  }
  render() {
    const tileSize = Config.screenSize === 'small' ? 1 : 2,
          state = this.state

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
            <span style={{fontSize: 20*tileSize}}>{state.seconds}</span>
          </div>
          <div style={{fontSize: 20}}>{state.day}</div>
          <div style={{fontSize: 20}}>{state.date}</div>
          {this.renderStockPrice()}
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
    }, 1000)

    this.fetcher = setInterval(async () => {
      try {
        const response = await fetch('https://api.iextrading.com/1.0/stock/SPY/quote'),
              json = await response.json()

        if (this.fetcher) {
          // we're still mounted
          this.setState({
            symbol:    json.symbol,
            price:     json.latestPrice,
            change:    json.change,
            pctChange: parseInt(json.changePercent * 100*100+.5)/100
          })
        }
      }
      catch (e) {
        console.dir(e)
      }
    }, 1000 * 5)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.fetcher) {
      clearInterval(this.fetcher)
      this.fetcher = null
    }
  }
}
