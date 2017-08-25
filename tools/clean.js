const mqtt   = require('mqtt'),
      client = mqtt.connect('mqtt://ha')

function main() {
    const cleaned = {}
    client.subscribe(['undefined/#', 'smartthings/Watch Smart TV [Harmony Activity]/#'])
    client.on('message', (topic, message) => {
        console.log('message', topic)
        if (!cleaned[topic]) {
            client.publish(topic, '', { retain: true})
            cleaned[topic] = true
        }
    })
}

main()
