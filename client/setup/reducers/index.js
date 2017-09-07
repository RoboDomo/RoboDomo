// Reducers for Redux

import SmartThingsReducer from './SmartThings'
import AutelisReducer from './Autelis'
import DevicesReducer from './Devices'

export default (state = {}, action) => {
  //console.log('reducer', action)
  try {
    switch (action.slice) {
      case 'smartthings':
        return {
          ...state,
          devices: SmartThingsReducer.slice(state.devices, action)
        }
      case 'autelis':
        return {
          ...state,
          devices: AutelisReducer.slice(state.autelis, action)
        }
      case 'devices':
        return {
          ...state,
          devices: DevicesReducer.slice(state.devices, action)
        }
    }
    return {
      ...state
    }
  }
  catch (e) {
    console.log('exception', e)
    throw e
  }
}
