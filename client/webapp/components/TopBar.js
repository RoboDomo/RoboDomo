import Config from '../../Config'

import React from 'react'

import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import NavMenu from './NavMenu'

const styles = {
  topBar: {
    // position: 'fixed',
    width:  '100%',
    zIndex: 1,
    margin: 0
  }
}

document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen

function isFullscreen() {
  return document.webkitIsFullScreen || document.mozIsFullScreen  || Document.fullscreen
}

function toggleFullscreen(element) {
  if (!isFullscreen()) {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
    }
  }
  else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
  else if (document.mozExitFullscreen) {
    document.mozExitFullscreen()
  }
}

class TopBar extends React.Component {
  state = { menu: false }
  constructor(props) {
    super(props)

    this.handleMenuClick = ::this.handleMenuClick
    this.handleToggleFullscreen = ::this.handleToggleFullscreen
  }

  render() {
    return (
      <div>
        <Navbar inverse fixedTop collapseOnSelect style={styles.topBar}>
          <Navbar.Header style={{width: '100%'}}>
            <Navbar.Brand
              onClick={this.handleToggleFullscreen}
            >
              <Glyphicon style={{marginRight: 8}} glyph="home"/>
              {Config.location}
              <Glyphicon style={{marginLeft: 8}} glyph={isFullscreen() ? 'resize-small' : 'resize-full'}/>
            </Navbar.Brand>
            <div style={{float: 'right'}}>
              <Nav>
                <NavItem eventKey={1}
                  onClick={this.handleMenuClick}
                >
                  <Glyphicon glyph="menu-hamburger"/>
                </NavItem>
              </Nav>
            </div>
          </Navbar.Header>
        </Navbar>
        <NavMenu 
          show={this.state.menu}
          toggle={this.handleMenuClick}
        />
      </div>
    )
  }

  handleToggleFullscreen() {
    if (Config.screenSize === 'small' && document.fullscreenEnabled) {
      toggleFullscreen(document.documentElement)
      setTimeout(() => {
        this.forceUpdate()
      }, 10)
    }
  }

  handleMenuClick() {
    this.setState({menu: !this.state.menu})
  }

  setRoute(e) {
    window.location.hash = e.target.getAttribute('data-route')
  }
}

export default TopBar
