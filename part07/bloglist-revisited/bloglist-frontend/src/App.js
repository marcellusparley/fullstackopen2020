import React, { useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import UserView from './components/UserView'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import NavMenu from './components/NavMenu'
import blogService from './services/blogs'
import { setNotification } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogsReducer'
import { getUsersInfo } from './reducers/usersInfoReducer'
import { logoutUser, alreadyLoggedIn } from './reducers/userReducer'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
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
  const history = useHistory()
  const notification = useSelector(state => state.notification)
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)
  const usersInfo = useSelector(state => state.usersInfo)
  const blogFormRef = useRef()


  // Get initial blogs state
  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(getUsersInfo())
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
      //history.push('/')
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
        <Togglable buttonLabel="Add Blog" ref={blogFormRef}>
          <BlogForm />
        </Togglable>
      </div>
    )
  }

  const userMatch = useRouteMatch('/users/:id')
  const userToView = userMatch
    ? usersInfo.find(u => u.id === userMatch.params.id)
    : null

  const blogMatch = useRouteMatch('/blogs/:id')
  const blogToView = blogMatch
    ? blogs.find(b => b.id === blogMatch.params.id)
    : null

  return (
    <div>
      <NavMenu user={user} handleLogout={handleLogout} />

      <h1>Blog App</h1>

      <Notification notification={notification} />

      <Switch>
        <Route path='/blogs/:id'>
          <BlogView blog={blogToView} />
        </Route>
        <Route path='/users/:id'>
          <UserView user={userToView} />
        </Route>
        <Route path='/users'>
          <UserList />
        </Route>
        <Route path='/'>
          {user === null ? loginForm() : blogForm() }
          <BlogList />
        </Route>
      </Switch>

    </div>
  )
}

export default App