/* LoginForm component. Show form for logging in and handles
 * the states for it's inputs.
 * */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const notifier = (message, type) => {
    dispatch(setNotification({ message, type }, 5))
  }

  // Login handler makes dispatches to redux store
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const creds = { username: username, password: password }
      setUsername('')
      setPassword('')
      await dispatch(loginUser(creds))
      notifier(`${creds.username} logged in!`, 'success')
    } catch (exception) {
      notifier(exception.response.data.error, 'error')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <label>Username:
        <input
          type="text"
          value={username}
          name="Username"
          id="login-username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </label>
      <label>Password:
        <input
          type="password"
          value={password}
          name="Password"
          id="login-password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </label>
      <button type="submit" id="login-submit" >Login</button>
    </form>
  )
}

export default LoginForm