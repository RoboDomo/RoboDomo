import Config from '../../../Config'

import React from 'react'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import Toggle from 'react-bootstrap-toggle'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Col from 'react-bootstrap/lib/Col'

export default class DimmerField extends React.Component {
    constructor(props) {
        super()
        if (!props.name) {
            throw new Error('DimmerField name prop required')
        }
        this.state = {
            value: props.value || 0
        }
    }

    render() {
        const value = parseInt('' + this.state.value),
              sliderCol = 12 - Config.ui.labelCol - 3

        return (
            <FormGroup>
                <Col
                    componentClass={ControlLabel}
                    sm={Config.ui.labelCol}
                     style={{whiteSpace: 'nowrap'}}
                >
                    {this.props.label}
                </Col>
                <Col sm={2}>
                    <Toggle
                        active={this.props.toggled}
                        onClick={this.onToggle.bind(this)}
                    />
                </Col>
                <Col sm={sliderCol} style={{textAlign: 'right', marginTop: 4}}>
                    <ReactBootstrapSlider
                        style={{width: '100%'}}
                        value={value}
                        step={1}
                        slideStop={this.onSliderChange.bind(this)}
                        min={1}
                        max={100}
                    />
                </Col>
                <Col sm={1}/>
            </FormGroup>
        )
    }

    // onSliderValueChange(value) {
    //     this.setState({ value: value})
    // }

    onSliderChange(e) {
        const value = e.target.value
        this.setState({ value: value })
        if (this.props.onSliderChange) {
            this.props.onSliderChange(this.props.name, value, this)
        }
    }
    onToggle(state) {
        if (this.props.onToggle) {
            this.props.onToggle(this.props.name, state, this)
        }
    }
}
