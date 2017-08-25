/**
 * Created by mykes on 6/28/2017.
 */

import Config from '../../Config'

import React from 'react'
import Screen from '../components/Screen'

import TiVo from '../controls/TiVo'

export default class TiVoScreen extends React.Component {
    constructor(props) {
        super()
        this.state = null
    }

    render() {
        const master = Config.tivo.guide

        return (
            <Screen
                header="TiVo"
                tabState="tivo"
            >
                {Config.tivo.boxes.map((tivo, ndx) => {
                    const key = 'tivo-' + ndx,
                          t = Object.assign({}, {guide: master}, tivo)

                    return (
                        <TiVo
                            key={key}
                            eventKey={ndx}
                            title={tivo.name}
                            box={t}
                        />
                    )
                })}
            </Screen>
        )
    }
}
