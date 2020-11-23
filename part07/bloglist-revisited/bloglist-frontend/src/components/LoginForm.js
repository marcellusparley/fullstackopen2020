// LoginForm component. Show form for logging in
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Helper for dispatching notifications
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

  const topMargin = {
    marginTop: 10
  }

  return (
    <div>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            name="Username"
            id="login-username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            name="Password"
            id="login-password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button style={topMargin}
            variant="primary"
            type="submit"
            id="login-submit"
          >
            Login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LoginForm