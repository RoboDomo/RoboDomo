import React from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import Config from '../Config'

export default class TopBar extends React.Component {
  state = { open: false  }
  render() {
    return (
      <div>
        <AppBar
          style={{position: 'fixed', top: 0}}
          title="RoboDomo"
          onLeftIconButtonTouchTap={() => {
            this.setState({ open: !this.state.open })
          }}
          onTitleTouchTap={() => {
            if (!this.props.dirty) {
              location.hash = ''
            }
          }}
        />
        <Drawer
          docked={false}
          open={this.state.open}
          onRequestChange={() => {
            this.setState({ open: !this.state.open})
          }}
        >
          {Object.keys(Config.routes).map((key) => {
            if (key === 'notFound') {
              return null
            }
            const r = Config.routes[key]
            return (
              <MenuItem 
                key={key}
                id={key}
                value={key}
                href={'#' + key}
                onClick={() => {
                  this.setState({ open: false })
                }}
              >
                {r.text}
              </MenuItem>
            )
          })}
        </Drawer>
      </div>
    )
  }
}
