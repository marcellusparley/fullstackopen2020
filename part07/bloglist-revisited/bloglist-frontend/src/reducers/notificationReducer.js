const reducer = (state = '', action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.notification
  case 'CLEAR':
    return null
  default:
    return state
  }
}

const timeouts = []

export const setNotification = (notification, timeout) => {
  return async dispatch => {
    dispatch ({
      type: 'SET_NOTIFICATION',
      notification: notification
    })

    while(timeouts.length > 0)
      clearTimeout(timeouts.pop())

    timeouts.push(setTimeout(() => dispatch(resetNotification()), timeout * 1000))
  }
}

export const resetNotification = () => {
  return {
    type: 'CLEAR'
  }
}

export default reducer