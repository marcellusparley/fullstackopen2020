// Reducer for user logging in and out
import loginService from '../services/login'
import blogService from '../services/blogs'

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.data
  case 'TOKEN_EXISTS':
    return action.data
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const loginUser = (credentials) => {
  return async dispatch => {
    const user = await loginService.login(credentials)

    // Sets user credentials to local storage
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )

    blogService.setToken(user.token)

    dispatch({
      type: 'LOGIN',
      data: user
    })
  }
}

export const logoutUser = () => {
  blogService.setToken(null)
  window.localStorage.removeItem('loggedBlogappUser')
  return {
    type: 'LOGOUT',
    data: null
  }
}

export const alreadyLoggedIn = (user) => {
  return {
    type: 'TOKEN_EXISTS',
    data: user
  }
}

export default reducer