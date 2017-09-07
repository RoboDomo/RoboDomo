import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Config from '../Config'

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  render() {
    return (
      <div>{'Dashbaord'}</div>
    )
  }
}
Dashboard.propTypes = {
  store: PropTypes.object
}

