import React from 'react'

import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import FlatButton from 'material-ui/FlatButton'

export default class BusyDialog extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary
                onClick={this.props.onCancel}
            />,
        ]

        return (
            <Dialog
                title={this.props.title}
                actions={actions}
                modal
                open
            >
                <p>{this.props.prompt}</p>
                <div style={{textAlign: 'center'}}>
                    <CircularProgress/>
                </div>
            </Dialog>
        )
    }
}

