import Config from '../Config'

import React from 'react'

import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'

export default class NumberPad extends React.Component {
    constructor(props) {
        super(props)
        this.buttons = props.buttons
        this.renderButton = props.renderButton
        this.space = props.space || 10
    }

    render() {
        const buttons = this.buttons,
              controlButton = Config.ui.controlButtonStyle

        return (
            <div style={{marginTop: this.space, textAlign: 'center'}}>
                <ButtonGroup>
                    {this.renderButton(buttons['1'].command, buttons['1'].display, 'default', controlButton)}
                    {this.renderButton(buttons['2'].command, buttons['2'].display, 'default', controlButton)}
                    {this.renderButton(buttons['3'].command, buttons['3'].display, 'default', controlButton)}
                </ButtonGroup>
                <br/>
                <ButtonGroup>
                    {this.renderButton(buttons['4'].command, buttons['4'].display, 'default', controlButton)}
                    {this.renderButton(buttons['5'].command, buttons['5'].display, 'default', controlButton)}
                    {this.renderButton(buttons['6'].command, buttons['6'].display, 'default', controlButton)}
                </ButtonGroup>
                <br/>
                <ButtonGroup>
                    {this.renderButton(buttons['7'].command, buttons['7'].display, 'default', controlButton)}
                    {this.renderButton(buttons['8'].command, buttons['8'].display, 'default', controlButton)}
                    {this.renderButton(buttons['9'].command, buttons['9'].display, 'default', controlButton)}
                </ButtonGroup>
                <br/>
                <ButtonGroup>
                    {this.renderButton(buttons['dot'].command, buttons['dot'].display, 'default', controlButton)}
                    {this.renderButton(buttons['0'].command, buttons['0'].display, 'default', controlButton)}
                    {this.renderButton(buttons['enter'].command, buttons['enter'].display, 'default', controlButton)}
                </ButtonGroup>
            </div>
        )
    }
}
