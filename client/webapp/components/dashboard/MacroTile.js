import Config from '../../../Config'
import React from 'react'

import MQTTButton from '../../../common/MQTTButton'
import Tile from './Tile'
import MQTT from '../../../lib/MQTT'
import Form from 'react-bootstrap/lib/Form'

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
                <Tile style={{textAlign: 'center', height: 70}}>
                    <MQTTButton
                        topic={this.topic}
                        value={this.name}
                        buttonStyle={{width: '80%', height: 50, margin: 'auto'}}
                        bsStyle="primary"
                    >
                        {this.label}
                    </MQTTButton>
                </Tile>
            )
        }
        return (
            <Tile
                backgroundColor={this.state.backgroundColor}
                onClick={this.onClick}
            >
                <Form style={{marginTop: 10, textAlign: 'center'}}>
                    <div style={{fontSize: 20}}>{this.config.label}</div>
                    <div style={{fontSize: 10}}>MACRO</div>
                </Form>
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