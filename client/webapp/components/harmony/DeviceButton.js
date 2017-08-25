/**
 * Harmony remote button.
 *
 * required props:
 * - device name of device (e.g. tivo-bolt, or tivo-mbr)
 * - command TiVo IRCODE
 */

import MQTT from '../../../lib/MQTT'
import MQTTButton from '../../../common/MQTTButton'

export default class DeviceButton extends MQTTButton {
    constructor(props) {
        super(props)
    }

    onClick() {
        this.setState({enabled: false})
        MQTT.publish(this.props.topic, this.props.command)
    }

}

