import React from 'react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

import AutelisSettings from './devices/AutelisSettings'

export default class DeviceDialog extends React.Component {
  constructor(props) {
    super(props)
    this.type = props.type
    this.store = props.store

    this.onChange  = this.onChange.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
    //this.onCancel  = this.onCancel.bind(this)
  }

  renderSettings() {
    switch (this.type) {
      case 'Autelis Pool Controller':
        return (
          <AutelisSettings
            store={this.store}
            ref={(ref) => {
              this.settings = ref
            }}
          />
        )
    }

    return (
      <div>
        <p>Configure Device</p>
        <TextField
          style={{marginRight: 30, width: '90%'}}
          name="topic"
          floatingLabelText="Topic"
          defaultValue={this.props.topic}
          onChange={this.onChange}
        />
        {this.props.name !== false ? <TextField
          style={{marginRight: 30, width: '90%'}}
          name="name"
          floatingLabelText="Name"
          defaultValue={this.props.name !== false ? this.props.name : ''}
          onChange={this.onChange}
        /> : null}
      </div>
    )
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.props.onCancel}
      />,
      <FlatButton
        label="Submit"
        primary
        // disabled={!this.state.value.length}
        onClick={this.onConfirm}
      />,
    ]

    return (
      <Dialog
        title={this.props.title}
        actions={actions}
        modal
        open
        bodyStyle={{backgroundColor: '#f8f8f8'}}
        autoScrollBodyContent
      >
        {this.renderSettings()}
      </Dialog>
    )
  }

  //onCancel() {
  //    if (this.props.onCancel) {
  //        this.props.onCancel()
  //    }
  //}

  onConfirm() {
    if (this.settings && this.settings.save) {
      this.settings.save(this.store)
    }
    if (this.props.onConfirm) {
      this.props.onConfirm()
    }
  }

  onChange() {

  }
}

DeviceDialog.propTypes = {
  type:     PropTypes.string,
  store:    PropTypes.object,
  title:    PropTypes.string,
  name:     PropTypes.string,
  topic:    PropTypes.string,
  onCancel: PropTypes.func
}
