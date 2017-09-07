export default class DevicesReducer {
  static add(state = {}, action) {
    let list = state.list || [],
        record = action.device

    //console.log('add', record, list, action)
    let found = false
    list = list.map((item) => {
      if ((item.topic === record.topic && item.name === record.name)) {
        found = true
        record.status = Object.assign(record.status, item.status)
        return record
      }
      return item
    })
    if (!found) {
      list.push(record)
    }

    //console.log('list', list)
    const ret =  {
      ...state,
      list: list,
    }
    //console.log('ret', ret)
    return ret
  }
  static slice(state = {}, action) {
    switch (action.type) {
      case 'ADD':
        return DevicesReducer.add(state, action)
    }
    return {
      ...state,
    }
  }
}

