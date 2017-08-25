import React from 'react'

import ConfirmDialog from '../components/ConfirmDialog'
import PromptDialog from '../components/PromptDialog'

import TextField from 'material-ui/TextField'
import Button from 'material-ui/RaisedButton'
import {Tab, Tabs} from 'material-ui/Tabs'

import Trashcan from 'material-ui/svg-icons/action/delete'
import Add from 'material-ui/svg-icons/content/add'
// array of board definitions
const model = []

export default class Dashboards extends React.Component {
    constructor(props) {
        super(props)
        this.dirty        = props.dirty || function () {
        }
        this.initialModel = Object.assign({}, model)

        this.state           = {model: model}
        this.onChange        = this.onChange.bind(this)
        this.onCancel        = this.onCancel.bind(this)
        this.onConfirm       = this.onConfirm.bind(this)
        this.addDashboard    = this.addDashboard.bind(this)
        this.removeDashboard = this.removeDashboard.bind(this)
        this.onEntered       = this.onEntered.bind(this)
        this.addTile         = this.addTile.bind(this)
    }

    renderDashboards() {
        if (!model.length) {
            return (
                <div style={{marginTop: 20}}>
                    No dashboards defined
                </div>
            )
        }
        return (
            <Tabs style={{marginTop: 20}}>
                {model.map((board) => {
                    return (
                        <Tab label={board.name}>
                            <div>Configure your dashboard {board.name}</div>
                            <Button
                                label="Add Tile"
                                icon={<Add/>}
                                // primary={true}
                                onClick={this.addTile}
                            />
                        </Tab>
                    )
                })}
            </Tabs>
        )
    }

    renderDialog() {
        switch (this.state.dialog) {
            case 'confirm':
                return (
                    <ConfirmDialog
                        title="Remove Dashboard"
                        onConfirm={this.onConfirm}
                        onCancel={this.onCancel}
                        prompt="Really remove dashboard?"
                        yes="Remove dashboard"
                    />
                )
            case 'prompt':
                return (
                    <PromptDialog
                        title="Name your Dashboard"
                        prompt="This name will show in the tab for this dashboard on the Dashbaords screen in the app."
                        onConfirm={this.onEntered}
                        onCancel={this.onCancel}
                        label="Dashboard name"
                        value=""
                    />
                )
            default:
                return null
        }
    }

    render() {
        return (
            <form style={{padding: 20}}>
                <h1>Dashboards</h1>
                <div style={{marginBottom: 20}}>
                    You may configure one or more dashboards on this screen. A dashboard is a grid of tiles that can
                    display information from your devices and/or control them. You might create a dashboard designed
                    for a tablet you would mount on the wall to display the information you want to see at a glance, as
                    well as controls for the features you want to control from that tablet. You might create a second
                    dashboard for a tablet you mount in another room with controls specific to that room. You might
                    create a third dashboard for a phone you keep on your nightstand. You are only limited by
                    your imagination.
                </div>
                <Button
                    label="Add Dashboard"
                    icon={<Add/>}
                    onClick={this.addDashboard}
                />
                <Button
                    label="Remove Dashboard"
                    icon={<Trashcan/>}
                    secondary={true}
                    onClick={this.removeDashboard}
                />
                {this.renderDashboards()}
                {this.renderDialog()}
            </form>
        )
    }

    onChange() {

    }

    addDashboard() {
        this.setState({
            dialog: 'prompt'
        })
    }

    onConfirm() {
        this.setState({dialog: null})
    }

    removeDashboard() {
        this.setState({dialog: 'confirm'})
    }

    onEntered(name) {
        model.push({
            name: name
        })
        this.setState({dialog: null})
    }

    onCancel() {
        this.setState({dialog: null})
    }

    addTile() {

    }
}
