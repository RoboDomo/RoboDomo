import Config from '../../../Config'

import React from 'react'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'

import Tile from './Tile'

export default class ClockTile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: ''
        }
    }

    render() {
        if (Config.screenSize === 'small') {
            return (
                <Tile>
                    <div style={{fontSize: 75, textAlign: 'center'}}>
                        {this.state.time}
                        <span style={{fontSize: 40}}>{this.state.seconds}</span>
                    </div>
                    <div>{this.state.date}</div>
                </Tile>
            )
        }
        return (
            <Tile
                backgroundColor="white"
                color="black"
                width="2"
                height="2"
            >
                <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: 75, width: '100%'}}>
                        {this.state.time}
                        <span style={{fontSize: 40}}>{this.state.seconds}</span>
                    </div>
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
                date:    d.toLocaleDateString()
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
