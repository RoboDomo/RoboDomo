/**
 * Created by mykes on 7/4/2017.
 */

import Config from '../../Config'

import Screen from '../components/Screen'
import React from 'react'

import Bravia from '../controls/Bravia'

export default class BraviaScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Screen
                header="Sony Bravia"
                tabState="bravia"
            >
                {Config.bravia.tvs.map((tv, ndx) => {
                    const key = 'tv-' + ndx
                    return (
                        <Bravia
                            key={key}
                            eventKey={String(ndx)}
                            title={tv.name}
                            tv={tv}
                        />
                    )
                })}
            </Screen>
        )
    }

}

