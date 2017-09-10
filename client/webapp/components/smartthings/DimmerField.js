import Config from '../../../Config'

import React from 'react'
import PropTypes from 'prop-types'

import ReactBootstrapSlider from 'react-bootstrap-slider'
import Toggle from 'react-bootstrap-toggle'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Col from 'react-bootstrap/lib/Col'

import NumberInput from '../../../common/NumberInput'

export default class DimmerField extends React.Component {
  constructor(props) {
    super()
    const value = props.value

    this.state = {
      value: value || 0
    }
  }

  componentWillReceiveProps(props) {

    this.setState({
      value: props.value
    })
  }

  renderSmall() {
    const value = parseInt('' + this.state.value)

    return (
      <FormGroup>
        <Col
          sm={Config.ui.labelCol}
          componentClass={ControlLabel}
          style={{whiteSpace: 'nowrap', float: 'left'}}
        >
          {this.props.label}
        </Col>
        <Col sm={Config.ui.fieldCol} style={{textAlign: 'right', marginRight: 10}}>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Toggle
              style={{marginRight: 10}}
              active={this.props.toggled}
              onClick={::this.onToggle}
            />
            <div style={{marginLeft: 8}}>
              <NumberInput
                value={value}
                onValueChange={::this.applyValueChange}
              />
            </div>
          </div>
        </Col>
      </FormGroup>
    )
  }

  render() {
    if (Config.screenSize === 'small') {
      return this.renderSmall()
    }
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
            onClick={::this.onToggle}
          />
        </Col>
        <Col sm={sliderCol} style={{textAlign: 'right', marginTop: 4}}>
          <ReactBootstrapSlider
            style={{width: '100%'}}
            value={value}
            step={1}
            slideStop={::this.onSliderChange}
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

  applyValueChange(value) {
    this.setState({ value: value })
    if (this.props.onValueChange) {
      this.props.onValueChange(this.props.name, value, this)
    }
  }
  onSliderChange(e) {
    const value = e.target.value
    this.applyValueChange(value)
  }
  onToggle(state) {
    if (this.props.onToggle) {
      this.props.onToggle(this.props.name, state, this)
    }
  }
}
DimmerField.propTypes = {
  name:  PropTypes.string.isRequired,
  value: PropTypes.number
}
