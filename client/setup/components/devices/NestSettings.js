import React, {Component} from 'react'
import TextField from 'material-ui/TextField'

export default class NestSettings extends Component {
  constructor(props) {
    super(props)

    this.store = props.store
  }

  render() {
    return (
      <form>
        <TextField/>
      </form>
    )
  }
}
