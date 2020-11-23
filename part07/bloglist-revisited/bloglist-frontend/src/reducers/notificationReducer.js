// Reducer for notifications
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

// Needs to track the timeouts so it can clear them
const timeouts = []

export const setNotification = (notification, timeout) => {
  return async dispatch => {
    dispatch ({
      type: 'SET_NOTIFICATION',
      notification: notification
    })

    // Clears all timeouts so previous ones don't interfere with new one
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