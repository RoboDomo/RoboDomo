import Config from '../../../Config'

import React from 'react'

import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'

const WIDTH = Math.min(window.innerWidth, 1024)
const COLUMNS = window.innerWidth < 800 ? 2 : 8
const SIZE = parseInt(WIDTH / COLUMNS, 10)

export default class Tile extends React.Component {
  constructor(props) {
    super(props)

    this.width  = (props.width || 1) * SIZE
    this.height = (props.height || 1) * SIZE

    this.onClick = this.onClick.bind(this)
  }

  render() {
    //if (Config.screenSize === 'small') {
    //  return (
    //    <div
    //      style={{textAlign: 'center', padding: 5, borderBottom: '1px solid black', minHeight: 60}}
    //      onClick={this.onClick}
    //    >
    //      {this.props.children}
    //    </div>
    //  )
    //}
    return (
      <div
        style={{
          float:           'left',
          width:           this.width,
          height:          this.height,
          backgroundColor: this.props.backgroundColor || undefined,
          color:           this.props.color || undefined,
          border:          '4px outset',
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

