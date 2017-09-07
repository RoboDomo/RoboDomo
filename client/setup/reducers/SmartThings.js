export default class SmartThingsReducer {
  static toggleDimmerFan(state, action) {
    const newState = Object.assign({}, state), 
          thing = state[action.name],
          type  = thing.type.toUpperCase()

    if (type === 'FAN') {
      thing.type = 'DIMMER'
    }
    else if (type === 'DIMMER') {
      thing.type = 'FAN'
    }
    return newState
  }

  static add(state, action) {
    const newState = Object.assign({}, state),
          topic  = action.topic,    // e.g. 'samsung'
          name   = action.name,     // e.g. 'Ceiling Fan'
          device = action.device,   // e.g. 'switch'
          status = action.status    // e.g. on/off, 99(level), etc.

    const record = state[name] ? Object.assign({}, state[name]) : {
      name:   name,
      topic:  topic,
      type:   device.toUpperCase(),
      status: {}
    }

    record.status = Object.assign(record.status, {
      [device]: status
    })

    const rstat = record.status,
          rtype = record.type

    if (rstat.switch && rtype !== 'FAN') {
      if (rstat.level !== undefined) {
        record.type = 'DIMMER'
      }
      else {
        record.type = 'SWITCH'
      }
    }
    else if (rstat.button) {
      if (rstat.motion) {
        record.type = 'DOORBELL'
      }
      else {
        record.type = 'BUTTON'
      }
    }
    else if (rstat.contact) {
      if (rstat.temperature) {
        record.type = 'MULTI SENSOR'
      }
      else {
        record.type = 'DOOR SENSOR'
      }
    }
    newState[name] = record
    return newState
  }

  static slice(state = {}, action) {
    switch (action.type) {
      case 'TOGGLE_DIMMER_FAN':
        return this.toggleDimmerFan(state, action)
      case 'ADD':
        return this.add(state, action)
    }
    return {
      ...state,
    }
  }
}

