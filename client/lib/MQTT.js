import Config from '../Config'
import EventEmitter from 'events'
import './mqtt-mosquitto'

const RETRY_TIME = 2000

class MQTT extends EventEmitter {
    constructor() {
        super()
        this.connect = this.connect.bind(this)
        this.cache = {}
        // setTimeout(() => {
        //     this.connect()
        // }, 1)
    }

    connect() {
        console.log('connecting', Config.mqtt.host, Config.mqtt.port)
        this.host  = Config.mqtt.host
        this.port  = Config.mqtt.port
        const mqtt = this.mqtt = new Paho.MQTT.Client(
            this.host,
            this.port,
            "web_" + parseInt(Math.random() * 100, 10)
        )

        this.onConnect        = this.onConnect.bind(this)
        this.onFailure        = this.onFailure.bind(this)
        this.onMessageArrived = this.onMessageArrived.bind(this)
        this.onConnectionLost = this.onConnectionLost.bind(this)

        mqtt.onConnect        = this.onConnect
        mqtt.onFailure        = this.onFailure
        mqtt.onMessageArrived = this.onMessageArrived
        mqtt.onConnectionLost = this.onConnectionLost

        this.mqtt.connect({
            timeout:      3,
            cleanSession: false,
            onSuccess:    this.onConnect.bind(this),
            onFailure:    this.onFailure.bind(this)
        })
    }

    onConnect() {
        this.emit('connect')
    }

    onFailure() {
        console.log('mqtt', 'onFailure')
        this.emit('failure')
        setTimeout(this.connect, RETRY_TIME)
    }

    emitMessage(topic, payload) {
        try {
            payload = JSON.parse(payload)
        }
        catch (e) {
        }
        this.emit(topic, topic, payload)
    }

    onMessageArrived(message) {
        const topic   = message.destinationName,
              payload = message.payloadString

        localStorage.setItem(topic, payload)
        this.cache[topic] = payload
        if (this.listenerCount(topic)) {
            console.log('message', topic)
            this.emitMessage(topic, payload)
        }
        this.emit('message', topic, payload)
    }

    onConnectionLost({errorCode, errorMessage}) {
        console.log('mqtt', 'onConnectionLost', errorMessage, this.subscriptions)
        this.emit('connectionlost')
        setTimeout(this.connect, RETRY_TIME)
    }

    subscribe(topic, handler) {
        if (!this.listenerCount(topic)) {
            console.log('MQTT subscribe', topic)
            this.mqtt.subscribe(topic)
        }
        if (handler) {
            this.on(topic, handler)
        }

        const state = this.cache[topic] || localStorage.getItem(topic)
        if (state && handler) {
            setTimeout(() => {
                try {
                    handler(topic, JSON.parse(state))
                }
                catch (e) {
                    handler(topic, state)
                }
            }, 1)
        }
    }

    unsubscribe(topic, handler) {
        if (handler) {
            this.removeListener(topic, handler)
            if (!this.listenerCount(topic)) {
                console.log('MQTT unsubscribe', topic)
                this.mqtt.unsubscribe(topic)
            }
        }
        else {
            this.mqtt.unsubscribe(topic)
        }
    }

    publish(topic, message) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message)
            this.mqtt.send(topic, message)
        }
        else {
            this.mqtt.send(topic, String(message))
        }
    }
}

export default new MQTT()