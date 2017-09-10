import Config from '../../Config'

import React from 'react'

import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'

class Clock extends React.Component {
  constructor() {
    super()
    this.state = {
      time: new Date().toLocaleString()
    }
  }

  render() {
    return (
      <span>{this.state.time}</span>
    )
  }

  componentDidMount() {
    this.state.timer = setInterval(() => {
      this.setState({time: new Date().toLocaleString()})
    })
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer)
      this.state.timer = null
    }
  }
}

const styles = {
  topBar: {
    // position: 'fixed',
    width:  '100%',
    zIndex: 1,
    margin: 0
  }
}

class TopBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    //if (Config.screenSize === 'small') {
    const routes = Config.routes

    return (
      <Navbar inverse fixedTop collapseOnSelect style={styles.topBar}>
        <Navbar.Header style={{width: '100%'}}>
          <Navbar.Brand>
            <a href="#dashboard">
              <Glyphicon style={{marginRight: 8}} glyph="home"/>
              {Config.location}
            </a>
          </Navbar.Brand>
          <div style={{float: 'right'}}>
            <Nav pullRight style={{display: 'flex', justifyContent: 'flex-end'}}>
              <NavDropdown
                noCaret
                style={{float: 'right', paddingRight: 20, zIndex: 1000}}
                eventKey={1}
                id="topbar-dropdown"
                title={<Glyphicon glyph="menu-hamburger"/>}
              >
                {Object.keys(routes).map((path) => {
                  const route = routes[path]
                  if (path === 'notFound') {
                    return null
                  }
                  return (
                    <MenuItem
                      eventKey={path}
                      key={path}
                      href="#"
                      data-route={`#${path}`}
                      onClick={this.setRoute}
                    >
                      {route.text}
                    </MenuItem>
                  )
                })}
                <MenuItem
                  eventKey={'reset'}
                  key={'reset'}
                  href="#"
                  onClick={this.reload}
                >
                  <Glyphicon glyph="refresh"/>
                  {' Reset'}
                </MenuItem>
              </NavDropdown>
            </Nav>
          </div>
        </Navbar.Header>
      </Navbar>
    )
    return (
      <Navbar inverse fixedTop collapseOnSelect style={styles.topBar}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#dashboard">
              <Glyphicon style={{marginRight: 8}} glyph="home"/>
              {Config.location}
            </a>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {Object.keys(routes).map((path) => {
              const route = routes[path]
              if (path === 'notFound') {
                return null
              }
              return (
                <NavItem
                  eventKey={path}
                  key={path}
                  href="#"
                  data-route={`#${path}`}
                  onClick={this.setRoute}
                >
                  {route.text}
                </NavItem>
              )
            })}
            <NavItem href="#" onClick={this.reload}>
              <Glyphicon glyph="refresh"/>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
    //}
    //return (
    //  <Navbar inverse fixedTop collapseOnSelect style={styles.topBar}>
    //    <Navbar.Header>
    //      <Navbar.Brand>
    //        <a href="#dashboard">
    //          <Glyphicon style={{marginRight: 8}} glyph="home"/>
    //          {Config.location}
    //        </a>
    //      </Navbar.Brand>
    //      <Navbar.Toggle/>
    //    </Navbar.Header>
    //    <Navbar.Collapse>
    //      <Nav pullRight>
    //        <NavItem>
    //          <span>{window.innerWidth} x {window.innerHeight}</span>
    //        </NavItem>
    //        <NavItem href="#" onClick={this.reload}>
    //          <Glyphicon glyph="refresh"/>
    //        </NavItem>
    //      </Nav>
    //    </Navbar.Collapse>
    //  </Navbar>
    //)
  }

  /**
     * reload app
     */
  reload() {
    localStorage.clear()
    window.location.reload()
  }

  setRoute(e) {
    window.location.hash = e.target.getAttribute('data-route')
  }
}

export default TopBar
