const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

export const setNotification = (notification, timeout) => {
  return async dispatch => {
    dispatch ({
      type: 'SET_NOTIFICATION',
      notification: notification
    })
    setTimeout(() => dispatch(resetNotification()), timeout * 1000)
  }
}

export const resetNotification = () => {
  return {
    type: 'CLEAR'
  }
}

export default reducer