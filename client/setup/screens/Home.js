import React from 'react'

import Button from 'material-ui/RaisedButton'

import {Card,CardHeader,CardText, CardActions} from 'material-ui/Card'

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title={<h3>MQTT</h3>}
                        subtitle="Configure and enable access to your devices via MQTT"
                    />
                    <CardText>
                        <span>
                            Configure your MQTT broker and microservice topics.  Each microservice you
                            enable here will add functionality to RoboDomo.  For example, the smartthings
                            microservice will enable the control and monitoring of the devices controled by
                            the SmartThings hub on your network.
                        </span>
                    </CardText>
                    <CardActions>
                        <Button
                            label="Configure"
                            href="#mqtt"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title={<h3>Devices</h3>}
                        subtitle="Configure and enable your devices"
                    />
                    <CardText>
                        <span>
                            Configure the devices you want RoboDomo to monitor and control.  These would be your
                            TVs, your wall switches/lights, thermostat, etc.
                        </span>
                    </CardText>
                    <CardActions>
                        <Button
                            label="Configure"
                            href="#devices"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="Dashboards"
                        subtitle="Configure one or more dashboards for the Web App"
                    />
                    <CardText>
                        <span>
                            A dashboard is a screen of buttons or controls, suitable for use on a tablet you mount
                            on the wall, or even a phone mounted on the wall.  Multiple dashboards are supported, so
                            you can have a two button screen for the phone on the wall in the bedroom and a rich
                            set of controls on the tablet screen that's on the wall in the living room.
                        </span>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#dashboards"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="Weather"
                        subtitle="Configure one or more zip codes for Weather forecast information"
                    />
                    <CardText>
                        <p>
                            Weather data can be used to trigger activities. For example, at sunset to turn on
                            your outdoor lights.
                        </p>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#weather"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="TV Guide"
                        subtitle="Configure TV Guides"
                    />
                    <CardText>
                        <p>
                            RoboDomo integrates your TV Guide with theater controls, including favorite
                            channel buttons, etc.
                        </p>
                        <p>
                            Multiple TV Guides are supported, in case you have two TV providers.
                        </p>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#tvguide"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="Autelis Pool & Spa Controller"
                        subtitle="Configure your Autelis Pool & Spa controller"
                    />
                    <CardText>
                        <p>
                            RoboDomo can interact with your Autelis controller to automate turning on and off
                            your pool pump and cleaner, as well as on screen controls to monitor and turn on
                            the various functions of your pool and spa.
                        </p>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#autelis"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="Nest Thermostats"
                        subtitle="Configure one or more Nest thermostats"
                    />
                    <CardText>
                        <p>
                            You will be able to log, monitor, control, and automate your heating and cooling
                            of your home from the Web App.
                        </p>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#nest"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="SmartThings"
                        subtitle="Add 'Things' to be controlled"
                    />
                    <CardText>
                        <p>
                            If your SmartThings hub can control it, RoboDomo can, too. Configure RoboDomo
                            to monitor and control your devices via your hub.
                        </p>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#smartthings"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="TiVo"
                        subtitle="Configure one or more TiVos"
                    />
                    <CardText>
                        <p>
                            Configure RoboDomo to directly control your TiVo DVR and set top boxes.
                            You will then be able to control your TiVo with intuitive screens in
                            the Web App.
                        </p>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#tivo"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="Denon AVR"
                        subtitle="Configure one or more Denon AVR Receivers"
                    />
                    <CardText>
                        <p>
                            RoboDomo intelligently provides controls for your AVR in the Web App.  For example,
                            if your home theater has a TiVo for content and AVR for audio, you will see TiVo
                            controls and AVR controls on the Theather screen.
                        </p>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#denon"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="LG TVs"
                        subtitle="Configure one or more LG TVs"
                    />
                    <CardText>
                        <p>
                            RoboDomo can control your LG TVs and provide intuitive controls in the Web App.  You
                            likely will use these controls to select TV input and use the built in apps, such as Netflix.
                        </p>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#lgtv"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="Sony Bravia TV"
                        subtitle="Configure one or more Sony Bravia TVs"
                    />
                    <CardText>
                        <p>
                            RoboDomo can control your Sony TVs and provide intuitive controls in the Web App.  You
                            likely will use these controls to select TV input and use the built in apps, such as Netflix.
                        </p>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#bravia"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
                <Card style={{marginBottom: 10}}>
                    <CardHeader
                        title="Harmony Hubs"
                        subtitle="Configure one or more Harmony Hubs"
                    />
                    <CardText>
                        <p>
                            RoboDomo can control one or more Harmony Hubs, to control your home theaters.  Starting
                            Activities and controlling devices is supported.  For some devices, such as the XBox One S or
                            non-connected audio receivers, the Harmony Hub allows those to be controlled by RoboDomo.
                        </p>
                    </CardText>
                    <CardActions>
                        <Button
                            href="#harmony"
                            label="Configure"
                            primary={true}
                        />
                    </CardActions>
                </Card>
            </div>
        )
    }
}
