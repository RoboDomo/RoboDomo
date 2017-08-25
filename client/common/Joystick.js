import Config from '../Config'
import React from 'react'

import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

export default class Joystick extends React.Component {
    constructor(props) {
        super(props)
        this.renderButton = props.renderButton
        this.up = props.up
        this.down = props.down
        this.left = props.left
        this.right = props.right
        this.select = props.select
        this.pageUp = props.pageUp
        this.pageDown = props.pageDown
    }

    render() {
        const me           = this,
              buttonStyle  = Config.ui.controlButtonStyle

        function topRow() {
            if (me.pageUp) {
                return (
                    <div style={{width: (buttonStyle.width * 3), marginLeft: 'auto', marginRight: 'auto'}}>
                        <ButtonGroup style={{marginLeft: (buttonStyle.width)}}>
                            {me.renderButton(me.up, <Glyphicon glyph="chevron-up"/>, 'default', buttonStyle)}
                            {me.renderButton(me.pageUp, <Glyphicon glyph="plus"/>, 'info', buttonStyle)}
                        </ButtonGroup>
                    </div>
                )
            }
            return (
                <div style={{width: (buttonStyle.width * 2), marginLeft: 'auto', marginRight: 'auto'}}>
                    <ButtonGroup style={{marginLeft: 0}}>
                        {me.renderButton(me.up, <Glyphicon glyph="chevron-up"/>, 'default', buttonStyle)}
                   </ButtonGroup>
                </div>
            )
        }

        function middleRow() {
            return (
                <div>
                    <ButtonGroup>
                        {me.renderButton(me.left, <Glyphicon glyph="chevron-left"/>, 'default', buttonStyle)}
                        {me.renderButton(me.select, 'Select', 'primary', buttonStyle)}
                        {me.renderButton(me.right, <Glyphicon glyph="chevron-right"/>, 'default', buttonStyle)}
                    </ButtonGroup>
                </div>
            )
        }


        function bottomRow() {
            if (me.pageDown) {
                return (
                    <div style={{width: (buttonStyle.width * 3), marginLeft: 'auto', marginRight: 'auto'}}>
                        <ButtonGroup style={{marginLeft: (buttonStyle.width)}}>
                            {me.renderButton(me.down, <Glyphicon glyph="chevron-down"/>, 'default', buttonStyle)}
                            {me.renderButton(me.pageDown, <Glyphicon glyph="minus"/>, 'info', buttonStyle)}
                        </ButtonGroup>
                    </div>
                )
            }
            else {
                return (
                    <div style={{width: (buttonStyle.width * 2), marginLeft: 'auto', marginRight: 'auto'}}>
                        <ButtonGroup style={{marginLeft: 0}}>
                            {me.renderButton(me.down, <Glyphicon glyph="chevron-down"/>, 'default', buttonStyle)}
                        </ButtonGroup>
                    </div>
                )
            }
        }

        return (
            <div style={{textAlign: 'center', marginTop: 10}}>
                {topRow()}
                {middleRow()}
                {bottomRow()}
            </div>
        )
    }
}
