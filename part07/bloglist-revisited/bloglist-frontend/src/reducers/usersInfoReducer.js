import userService from '../services/users'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'GET_ALL':
    return action.data
  default:
    return state
  }
}

export const getUsersInfo = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'GET_ALL',
      data: users
    })
  }
}

export default reducer