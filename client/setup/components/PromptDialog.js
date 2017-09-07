import React from 'react'

import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

export default class PromptDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state     = {
      value: props.value
    }
    this.onChange  = this.onChange.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
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
        disabled={!this.state.value.length}
        onClick={this.onConfirm}
      />,
    ]

    return (
      <Dialog
        title={this.props.title}
        actions={actions}
        modal={this.props.modal || true}
        open
      >
        <p>{this.props.prompt}</p>
        <TextField
          style={{marginRight: 30, width: '90%'}}
          name="confirm"
          floatingLabelText={this.props.label}
          defaultValue={this.props.value}
          onChange={this.onChange}
        />
      </Dialog>
    )
  }

  onChange(e, value) {
    console.log(e.target.name, value)
    this.setState({
      value: value
    })
  }

  onConfirm() {
    this.props.onConfirm(this.state.value)

  }
}


