import Config from '../../../Config'
import React from 'react'

import MQTTButton from '../../../common/MQTTButton'
import Tile from './Tile'
import MQTT from '../../../lib/MQTT'

export default class MacroTile extends React.Component {
    constructor(props) {
        super(props)
        this.config  = props.config
        this.label   = this.config.label
        this.name    = this.config.name
        this.topic   = `${Config.mqtt.macros}/run`
        this.onClick = this.onClick.bind(this)

        this.state = {backgroundColor: 'white'}
        console.log('construct', this.config)
    }

    render() {
        console.log('render', this.state)
        if (Config.screenSize === 'small') {
            return (
                    <MQTTButton
                        topic={this.topic}
                        value={this.name}
                        buttonStyle={{width: '80%', height: 50}}
                        bsStyle="primary"
                    >
                        {this.label}
                    </MQTTButton>
            )
        }
        return (
            <Tile
                backgroundColor={this.state.backgroundColor}
                onClick={this.onClick}
            >
                <div>{this.config.label}</div>
            </Tile>
        )
    }

    onClick() {
        console.log('onClick', this.topic, this.name)
        MQTT.publish(this.topic, this.name)
        this.setState({backgroundColor: 'cyan'})
        setTimeout(() => {
            this.setState({backgroundColor: 'white'})
        }, 250)
    }
}