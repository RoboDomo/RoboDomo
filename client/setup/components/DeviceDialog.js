import React from 'react'

import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

export default class DeviceDialog extends React.Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onConfirm = this.onConfirm.bind(this)
        this.onCancel = this.onCancel.bind(this)
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.props.onCancel}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                // disabled={!this.state.value.length}
                onClick={this.onConfirm}
            />,
        ];

        return (
            <Dialog
                title={this.props.title}
                actions={actions}
                modal={true}
                open={true}
            >
                <p>Configure Device</p>
                <TextField
                    style={{marginRight: 30, width: '90%'}}
                    name="topic"
                    floatingLabelText="Topic"
                    // defaultValue={this.props.value}
                    onChange={this.onChange}
                />
                <TextField
                    style={{marginRight: 30, width: '90%'}}
                    name="name"
                    floatingLabelText="Name"
                    // defaultValue={this.props.value}
                    onChange={this.onChange}
                />
            </Dialog>
        )
    }

    onCancel() {
        if (this.props.onCancel) {
            this.props.onCancel()
        }
    }

    onConfirm() {

    }

    onChange() {

    }
}
