import React from 'react'

import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

export default class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const actions = [
            <FlatButton
                label={this.props.no || "Cancel"}
                primary={this.props.no_primary || false}
                secondary={this.props.no_seconary || true}
                onClick={this.props.onCancel}
            />,
            <FlatButton
                label={this.props.yes || "Submit"}
                primary={this.props.yes_primary || true}
                secondary={this.props.yes_seconary || false}
                onClick={this.props.onConfirm}
            />,
        ];

        return (
            <Dialog
                title={this.props.title}
                actions={actions}
                modal={this.props.modal || true}
                open={true}
            >
                <p>{this.props.prompt}</p>
            </Dialog>
        )
    }
}


