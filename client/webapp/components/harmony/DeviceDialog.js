import Config from '../../../Config'

import React from 'react'

import Modal from 'react-bootstrap/lib/Modal'

import RemoteControl from './RemoteControl'
import RemoteButton from './DeviceButton'

export default class DeviceDialog extends React.Component {
    constructor(props) {
        super(props)
        this.slug = this.props.device.slug
        this.hub = this.props.hub
        this.device = props.device

        this.onClose = this.onClose.bind(this)
        this.renderButton     = this.renderButton.bind(this)
        this.renderMiniButton = this.renderMiniButton.bind(this)
    }

    renderButton(command, text, style) {
        if (!text) {
            text = command
        }
        return (
            <RemoteButton
                hub={this.hub}
                device={this.device.slug}
                command={command}
                bsStyle={style}
            >
                {text}
            </RemoteButton>
        )
    }

    renderMiniButton(command, text, style) {
        return (
            <RemoteButton
                hub={this.hub}
                device={this.device.slug}
                command={command}
                buttonStyle={Config.ui.miniButtonStyle}
                bsStyle={style}
            >
                {text}
            </RemoteButton>

        )
    }

    render() {
        const device = this.props.device,
            hub = this.hub

        if (!device) {
            return null
        }

        return (
            <Modal
                dialogClassName="device-modal"
                show={true}
                onHide={this.onClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{device.label}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{width: '90%', maxHeight: '90%', overflow: 'auto'}}>
                        <div style={{overflow: 'auto'}}>
                            <RemoteControl
                                controlGroup={this.props.device.controlGroup}
                                renderButton={this.renderButton}
                                renderMiniButton={this.renderMiniButton}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    onClose() {
        if (this.props.onClose) {
            this.props.onClose()
        }
    }

}
