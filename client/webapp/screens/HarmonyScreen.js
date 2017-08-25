import Config from '../../Config'

import Screen from '../components/Screen'
import React from 'react'

import Harmony from '../controls/Harmony'

export default class HarmonyScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Screen
                header="Harmony Hubs"
                tabState="bravia"
            >
                {Config.harmony.hubs.map((hub, ndx) => {
                    const key = 'hub-' + ndx
                    return (
                        <Harmony
                            key={key}
                            eventKey={String(ndx)}
                            title={hub.name}
                            hub={hub}
                        />
                    )
                })}
            </Screen>
        )
    }

}
