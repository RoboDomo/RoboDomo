import Config from '../../Config'
import React from 'react'
import TopBar from '../components/TopBar'

const bowser = require('bowser')

class Root extends React.Component {
  renderInner() {
    return (
      <div style={{flex: 1, overflowX: 'hidden', overflowY: 'auto'}}>
        <TopBar/>
        <div style={{paddingTop: 50, paddingBottom: 50}}>
          {this.props.children}
        </div>
      </div>
    )
  }

  render() {
    if (Config.screenSize === 'small' || (bowser.tablet && window.innerWidth < 1024)) {
      return this.renderInner()
    }
    else {
      return (
        <div style={{ display: 'flex', height: '100%'}}>
          <div style={{display: 'flex', marginLeft: 'auto', marginRight: 'auto'}}>
            <div style={{width: 1024, height: 768}}>
              {this.renderInner()}
            </div>
          </div>
        </div>
      )
    }
  }

  onEnd(ndx) {
    const hash = Object.keys(Config.routes)[ndx] || ''
    location.hash = '#' + hash
  }
}

export default Root
