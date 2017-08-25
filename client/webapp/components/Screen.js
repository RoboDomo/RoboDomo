import Config from '../../Config'

import React from 'react'
import Panel from 'react-bootstrap/lib/Panel'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

import SideNav from '../components/SideNav'

class Clock extends React.Component {
    render() {
        return (
            <div
                style={{
                    textAlign:    'center',
                    fontSize:     24,
                    marginBottom: 10
                }}
            >
                {new Date().toLocaleTimeString()}
            </div>
        )
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({foo: 1})
        }, 1000)
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }
}

export default class Screen extends React.Component {
    constructor(props) {
        super(props)

        const tabState = props.tabState

        if (!tabState) {
            throw new Error('Screen requires tabState prop')
        }
        this.state     = {
            children:  Array.isArray(props.children) ? props.children : [props.children],
            tabState:  tabState,
            activeTab: localStorage.getItem(tabState + 'TabState') || '0'
        }
        this.changeTab = this.changeTab.bind(this)
    }

    render() {
        if (Config.screenSize === 'small') {
            return (
                <Grid fluid={true} style={{height: '100%', padding: '0 5 50 5'}}>
                    <Row style={{
                        marginTop:    0,
                        paddingRight: 4,
                        paddingLeft:  4,
                        height:       '100%',
                        overflow:     'hidden'
                    }}>
                        <Col sm={12} style={{height: '100%', overflow: 'auto'}}>
                            <h1>{this.props.header}</h1>
                            <Tabs
                                bsStyle="pills"
                                defaultActiveKey={this.state.activeTab}
                                id={this.state.tabState + '-tabs'}
                                onSelect={this.changeTab}
                                mountOnEnter={true}
                                unmountOnExit={true}
                            >
                                {this.state.children.map((child, ndx) => {
                                    return (
                                        <Tab
                                            key={child.key}
                                            eventKey={String(ndx)}
                                            title={child.props.title}
                                        >
                                            {child}
                                        </Tab>
                                    )
                                })}
                            </Tabs>
                        </Col>
                    </Row>
                </Grid>
            )
        }
        return (
            <Grid fluid={true} style={{height: '100%', paddingBottom: 50}}>
                <Row style={{paddingTop: 10, height: '100%', overflow: 'hidden'}}>
                    <Col sm={2}>
                        <Clock/>
                        <SideNav/>
                    </Col>
                    <Col sm={10} style={{height: '100%', overflow: 'auto'}}>
                        <Panel
                            header={this.props.header}
                            bsStyle={Config.ui.panelType}
                        >
                            <Tabs
                                bsStyle="pills"
                                defaultActiveKey={this.state.activeTab}
                                id={this.state.tabState + '-tabs'}
                                onSelect={this.changeTab}
                                mountOnEnter={true}
                                unmountOnExit={true}
                            >
                                {this.state.children.map((child, ndx) => {
                                    return (
                                        <Tab
                                            key={child.key}
                                            eventKey={String(ndx)}
                                            title={child.props.title}
                                        >
                                            {child}
                                        </Tab>
                                    )
                                })}
                            </Tabs>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        )
    }

    changeTab(eventKey) {
        localStorage.setItem(this.state.tabState + 'TabState', eventKey)
        this.setState({activeTab: eventKey})
    }
}
