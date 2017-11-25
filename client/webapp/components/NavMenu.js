import React, {Component} from 'react'

import Config from '../../Config'

import Modal from 'react-bootstrap/lib/Modal'

import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'

export default class NavMenu extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.toggle}
      >
        <Modal.Header closeButton>
          <Modal.Title>{'Quick Navigation'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {Object.keys(Config.routes).map((key, ndx) => {
              const route = Config.routes[key]
              if (key === 'notFound') {
                return null
              }
              return (
                <ListGroupItem
                  key={ndx}
                  href={'#' + key}
                  onClick={this.handleMenuClick.bind(this, key)}
                >
                  {route.text}
                </ListGroupItem>
              )
            })}
            <ListGroupItem
              onClick={this.reload}
            >
              {'Reload'}
            </ListGroupItem>
          </ListGroup>
        </Modal.Body>
      </Modal>
    )
  }
  /**
    * reload app
    */
  reload() {
    localStorage.clear()
    window.location.reload()
  }

  handleMenuClick(key) {
    console.log('click', key)
    this.props.toggle()
  }
}
