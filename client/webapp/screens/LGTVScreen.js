/**
 * Created by mykes on 7/4/2017.
 */

import Config from '../../Config'

import React from 'react'
import Screen from '../components/Screen'

import LGTV from '../controls/LGTV'

export default class LGTVScreen extends React.Component {
    constructor(props) {
        super()
        this.state = null
    }

    render() {
        return (
            <Screen
                header="LGTV"
                tabState="lgtv"
            >
                {Config.lgtv.tvs.map((tv, ndx) => {
                    const key = 'tv-' + ndx
                    return (
                        <LGTV
                            key={key}
                            eventKey={ndx}
                            title={tv.name}
                            tv={tv}
                        />
                    )
                })}
            </Screen>
        )
    }
}

