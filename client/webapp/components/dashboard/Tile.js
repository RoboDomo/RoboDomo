import Config from '../../../Config'

import React from 'react'

import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'

const SIZE = 128

export default class Tile extends React.Component {
    constructor(props) {
        super(props)

        this.width  = (props.width || 1) * SIZE
        this.height = (props.height || 1) * SIZE

        this.onClick = this.onClick.bind(this)
    }

    render() {
        if (Config.screenSize === 'small') {
            return (
                <div
                    style={{textAlign: 'center', padding: 5, borderBottom: '1px solid black', minHeight: 60}}
                    onClick={this.onClick}
                >
                    {this.props.children}
                </div>
            )
        }
        return (
            <div
                style={{
                    float:           'left',
                    width:           this.width,
                    height:          this.height,
                    backgroundColor: this.props.backgroundColor || 'white',
                    color:           this.props.color || 'black',
                    border:          '4px outset grey',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center'
                }}
                onClick={this.onClick}
            >
                {this.props.children}
            </div>
        )
    }

    onClick() {
        const ref = this.props.onClick
        if (typeof ref === 'string') {
            window.location.hash = ref
        }
        else if (typeof ref === 'function') {
            ref()
        }
    }
}

