import React from 'react'
import AppBar from 'material-ui/AppBar'

export default class TopBar extends React.Component {
  render() {
    return (
      <AppBar
        style={{position: 'fixed', top: 0}}
        title="RoboDomo Setup"
        onTitleTouchTap={() => {
          if (!this.props.dirty) {
            location.hash = ''
          }
        }}
      />
    )
  }
}
