import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField'
import Button from 'material-ui/RaisedButton'

const model = {
    mqttHost:    '',
    mqttPort:    9000,
    denon:       'denon',
    nest:        'nest',
    weather:     'weather',
    autelis:     'autelis',
    tvguide:     'tvguide',
    harmony:     'harmony',
    tivo:        'tivo',
    bravia:      'bravia',
    lgtv:        'lgtv',
    smartthings: 'smartthings',
    macros:      'macros',
}

export default class MQTT extends React.Component {
    constructor(props) {
        super(props)
        this.dirty = props.dirty || function(){}
        this.onChange = this.onChange.bind(this)
        this.initialModel = Object.assign({}, model)
    }

    render() {
        return (
            <form style={{padding: 20}}>
                <h1>MQTT</h1>
                <div> {`
                    RoboDomo operates through a single MQTT broker where device state messages
                    are published. The connection string for this MQTT broker is of the form <code>
                    mqtt://hostname:port</code>. This hostname for your network is something
                    you set up. The default port for MQTT is 9000.
                `}` </div>
                <TextField
                    id="mqttHost"
                    name="mqttHost"
                    style={{marginRight: 30}}
                    floatingLabelText="MQTT Hostname"
                    defaultValue={model.mqttHost}
                    onChange={this.onChange}
                />
                <TextField
                    id="mqttPort"
                    name="mqttPort"
                    style={{width: 80}}
                    type="number"
                    floatingLabelText="Port"
                    defaultValue={model.mqttPort}
                    onChange={this.onChange}
                />
                <p> {`
                    Each of the topics published via the MQTT broker, by convention, begin with a string (topic base) to
                    identify the source. For example, Smartthings hub message topics typically begin with <code>smartthings</code>
                    are something like: <code>smartthings/device/switch</code>. If you've set up the
                    smartthings-mqtt-bridge
                    microservice to use something other than smartthings, change it here. For all of the potential
                    microservices you may have installed and changed the default topic base, change those here as well.
                    If you have not installed a particular microservice, clear the field to disable the associated
                    feature.
                `} </p>
                <TextField
                    id="denon"
                    style={{marginRight: 30}}
                    name="denon"
                    hintText="DISABLED"
                    floatingLabelText="Denon AVR topic base"
                    defaultValue={model.denon}
                    onChange={this.onChange}
                />
                <TextField
                    id="nest"
                    style={{marginRight: 30}}
                    name="nest"
                    hintText="DISABLED"
                    floatingLabelText="Nest Thermostat topic base"
                    defaultValue={model.nest}
                    onChange={this.onChange}
                />
                <TextField
                    id="weather"
                    name="weather"
                    hintText="DISABLED"
                    floatingLabelText="Weather topic base"
                    defaultValue={model.weather}
                    onChange={this.onChange}
                />
                <br/>
                <TextField
                    id="autelis"
                    name="autelis"
                    style={{marginRight: 30}}
                    hintText="DISABLED"
                    floatingLabelText="Autelis Pool Control topic base"
                    defaultValue={model.autelis}
                    onChange={this.onChange}
                />
                <TextField
                    id="tvguide"
                    name="tvguide"
                    style={{marginRight: 30}}
                    hintText="DISABLED"
                    floatingLabelText="TV Guide topic base"
                    defaultValue={model.tvguide}
                    onChange={this.onChange}
                />
                <TextField
                    id="harmony"
                    name="harmony"
                    hintText="DISABLED"
                    floatingLabelText="Harmony Hub topic base"
                    defaultValue={model.harmony}
                    onChange={this.onChange}
                />
                <br/>
                <TextField
                    id="tivo"
                    name="tivo"
                    style={{marginRight: 30}}
                    hintText="DISABLED"
                    floatingLabelText="TiVo DVR/Mini topic base"
                    defaultValue={model.tivo}
                    onChange={this.onChange}
                />
                <TextField
                    id="bravia"
                    name="bravia"
                    style={{marginRight: 30}}
                    hintText="DISABLED"
                    floatingLabelText="Sony Bravia TV topic base"
                    defaultValue={model.bravia}
                    onChange={this.onChange}
                />
                <TextField
                    id="lgtv"
                    name="lgtv"
                    hintText="DISABLED"
                    floatingLabelText="LG TV topic base"
                    defaultValue={model.lgtv}
                    onChange={this.onChange}
                />
                <br/>
                <TextField
                    id="smartthings"
                    name="smartthings"
                    style={{marginRight: 30}}
                    hintText="DISABLED"
                    floatingLabelText="SmartThings Hub topic base"
                    defaultValue={model.smartthings}
                    onChange={this.onChange}
                />
                <TextField
                    id="macros"
                    name="macros"
                    hintText="DISABLED"
                    floatingLabelText="Macros Service topic base"
                    defaultValue={model.macros}
                    onChange={this.onChange}
                />
                <br/>
                <Button
                    style={{marginTop: 20}}
                    fullWidth
                    primary
                    label="Save"
                />
            </form>
        )
    }

    onChange(e, value) {
        const name           = e.target.name,
                    oldValue = model[name],
                    initialModel = this.initialModel

        model[name]= value
        console.log(model, initialModel)
        if (oldValue !== value) {
            this.dirty(true)
        }

        for (const v in model) {
            if (model[v] !== initialModel[v]) {
                this.dirty(true)
                return
            }
        }
        this.dirty(false)
    }
}

MQTT.propTypes = {
    dirty: PropTypes.func,
}
