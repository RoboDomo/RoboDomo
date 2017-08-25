import React from 'react'

import Screen from '../components/Screen'

import Denon from '../controls/Denon'

export default class DenonScreen extends React.Component {
    constructor(props) {
        super()
        this.state = null
    }

    render() {
        return (
            <Screen
                header="Denon"
                tabState="denon"
            >
                <Denon
                    key="denon1"
                    eventKey="0"
                    title="Denon AVR S910W"
                    device="denon-s910w"
                />
            </Screen>
        )
    }
}