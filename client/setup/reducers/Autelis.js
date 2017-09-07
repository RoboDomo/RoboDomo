export default class AutelisReducer {
  static add(state, action) {
    const values = action.values,
          newState = Object.assign({}, state),
          topic  = values.topic,    // e.g. 'samsung'
          name   = 'AUTELIS',     // e.g. 'Ceiling Fan'
          device = values,   // e.g. 'switch'
          status = {} // e.g. on/off, 99(level), etc.

    const record = state[name] ? Object.assign({}, state[name]) : {
      name:   'AUTELIS',
      topic:  topic === undefined ? 'autalis' : topic,
      type:   'AUTELIS',
      values: device,
      status: status
    }
    newState[name] = record
    return newState
  }

  static updateField(state, action) {
    const newState = Object.assign({}, state),
          id = action.id,
          value = action.value === 'undefined' ? undefined : action.value
    
    newState[id].values[id] = value
    return newState
  }

  static slice(state = {}, action) {
    switch (action.type) {
      case 'ADD':
        return AutelisReducer.add(state, action)
      case 'UPDATE_FIELD':
        return AutelisReducer.updateField(state, action)
    }
    return {
      ...state,
    }
  }
}

