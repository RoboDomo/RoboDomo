import React, {Component} from 'react'
import TextField from 'material-ui/TextField'

export default class AutelisSettings extends Component {
  constructor(props) {
    super(props)

    this.store = props.store

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    const target = e.target

    this.store.dispatch({
      type:  'UPDATE',
      id:    target.id.toLowerCase(),
      value: target.value
    })
  }

  /**
   * render form fields for AUX choices
   *
   * @returns {JSX} fields for AUX choices
   */
  renderFields() {
    const fields = []

    for (let aux = 1; aux < 16; aux++) {
      const key = 'AUX' + aux

      fields.push(
        <TextField
          id={key}
          name={key}
          key={key}
          fullWidth
          floatingLabelText={key.toUpperCase()}
          onChange={this.onChange}
        />
      )
    }
    return fields
  }

  /**
   * Render the guts of the component (dialog, typically)
   *
   * @returns {JSX} form
   */
  render() {
    const state = this.store.getState(),
          devices = state.devices || {},
          autelis = devices.AUTELIS || {},
          values = autelis.values || {}

    if (!state.devices || !state.devices.autelis) {
      values.topic = 'autelis'
    }
    return (
      <form>
        <p> 
          {`
              Enter name for this device.  This will be used as part of the MQTT topic for accessing the Autelis controller 
              status and controls.  Autelis is something of a special case, since it is not expected for a home to have more 
              than one pool (and thus controller).  
              `} 
        </p>
        <TextField
          id="topic"
          name="topic"
          fullWidth
          floatingLabelText="Device Name"
          defaultValue={values.topic}
          onChange={this.onChange}
        />
        <p> 
          {` 
              Assign labels to each of the aux connections for your Autelis Pool Controller. For example, if your AUX1 is 
              connected to your waterfall, you would enter "waterfall" (no quotes) for AUX1. This string is what will be 
              displayed in the App next to controls and so on.  
              `} 
        </p>
        <p> 
          {` 
              Leave the fields blank for any AUX that are not connected.
              `} 
        </p>
        {this.renderFields()}
      </form>
    )
  }

  /**
     * Save state of the edited form.
     */
  save() {
    const state = this.store.getState(),
          devices = state.devices || {},
          autelis = devices.AUTELIS || {},
          values = autelis.values || {}

    this.store.dispatch({
      slice:  'autelis',
      type:   'ADD',
      values: values
    })
    console.log('updated store', this.store.getState())
  }
}
