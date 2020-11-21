import React, { useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import { setNotification } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogsReducer'
import { logoutUser, alreadyLoggedIn } from './reducers/userReducer'
import './App.css'

/* App is the main component
 * BlogList is the component that displays each Blog component
 * BlogForm displays when user is logged in. It handles the form for adding
 * new Blogs to the database. It handles the states for its own inputs.
 * LoginForm only shows when user is not logged in. Allows user to login. It
 * handles the states for it's inputs.
 * Notification displays messages to user controlled by notification state
 * Togglable is a component that allows the hiding and showing of it's children
 * blogService handles adding blogs and manages the token.
 * loginService handles logging in
 * uses redux store for user, blogs, and notification states
 * */
const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const user = useSelector(state => state.user)
  const blogFormRef = useRef()


  // Get initial blogs state
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  // Get token from local storage if it exists
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(alreadyLoggedIn(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  // Handler for logging out
  const handleLogout = async (event) => {
    event.preventDefault()

    try {
      await dispatch(logoutUser())
      notify('Logged out', 'success')
    } catch (e) {
      notify(e.response.data.error, 'error')
    }
  }

  const notify = (message, mtype) => {
    dispatch(setNotification(
      {
        message: message,
        type: mtype
      },
      5
    ))
  }

  // Following two functions just to make things compact
  const loginForm = () => {
    return (
      <LoginForm />
    )
  }

  const blogForm = () => {
    return (
      <div>
        <label>
          {user.name} Logged-in
          <button onClick={handleLogout}>Logout</button>
        </label>
        <Togglable buttonLabel="Add Blog" ref={blogFormRef}>
          <BlogForm />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h1>Blog App</h1>

      <Notification notification={notification} />

      {user === null ? loginForm() : blogForm() }

      <BlogList />

    </div>
  )
}

export default App