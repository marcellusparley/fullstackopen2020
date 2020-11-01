/* LoginForm component. Show form for logging in and handles
 * the states for it's inputs. Uses the login service to make
 * the api call
 * */
import React, { useState } from 'react'
import loginService from '../services/login'

const LoginForm = ({ userChange, setToken, notifier }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Login handler it uses userChange function to set the user
  // state in App component, setToken to set token var in blogs.js,
  // and uses the notifier to change the notification state in App
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      // Sets user credentials to local storage
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setToken(user.token)
      setUsername('')
      setPassword('')
      notifier(`${user.username} logged in!`, 'success')
      userChange(user)
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
          onChange={({ target }) => setUsername(target.value)}
        />
      </label>
      <label>Password:
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </label>
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm