// FanField

import Config from '../../../Config'

import React from 'react'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Col from 'react-bootstrap/lib/Col'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Button from 'react-bootstrap/lib/Button'

export default class FanField extends React.Component {
    constructor(props) {
        super()
        if (!props.name) {
            throw new Error('FanField name prop required')
        }
    }
    
    render() {
        const onChange = this.props.onChange ? this.props.onChange.bind(this) : ()=> {},
              props = this.props,
              name = props.name,
              styles = { }
              
        styles.on = props.toggled ? 'default' : 'primary'
        styles.low = props.toggled && props.value <= 33 ? 'primary' : 'default'
        styles.medium = props.toggled && props.value <= 66 && props.value > 33 ? 'primary' : 'default'
        styles.high = props.toggled && props.value > 66 ? 'primary' : 'default'

        return (
            <FormGroup>
                <Col
                    sm={Config.ui.labelCol}
                    componentClass={ControlLabel}
                    style={{whiteSpace: 'nowrap', float: 'left'}}
                >
                    {props.label}
                </Col>
                <Col
                    sm={Config.ui.fieldCol}
                    style={{textAlign: 'right', paddingRight: 50}}
                >
                    <ButtonGroup>
                        <Button
                            bsSize={Config.ui.bsSize}
                            bsStyle={styles.on}
                            onClick={() => onChange(name, 'off', this)}
                        >
                            Off
                        </Button>
                        <Button
                            bsSize={Config.ui.bsSize}
                            bsStyle={styles.low}
                            onClick={() => onChange(name, 'low', this)}
                        >
                            Low
                        </Button>
                        <Button
                            bsSize={Config.ui.bsSize}
                            bsStyle={styles.medium}
                            onClick={() => onChange(name, 'medium', this)}
                        >
                            Medium
                        </Button>
                        <Button
                            bsSize={Config.ui.bsSize}
                            bsStyle={styles.high}
                            onClick={() => onChange(name, 'high', this)}
                        >
                            High
                        </Button>
                    </ButtonGroup>
                </Col>
            </FormGroup>
        )
    }
}
