// App is the main component
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useRouteMatch, /*useHistory*/ } from 'react-router-dom'

// Component imports
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import UserView from './components/UserView'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import NavMenu from './components/NavMenu'

// Service import
import blogService from './services/blogs'

// Reducer imports
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogsReducer'
import { getUsersInfo } from './reducers/usersInfoReducer'
import { logoutUser, alreadyLoggedIn } from './reducers/userReducer'

// CSS disabled since using Bootstrap
//import './App.css'

const App = () => {
  const dispatch = useDispatch()
  //const history = useHistory()
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

  // Helper for dispatching notifications
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

  // Parameter routing set up
  const userMatch = useRouteMatch('/users/:id')
  const userToView = userMatch
    ? usersInfo.find(u => u.id === userMatch.params.id)
    : null

  const blogMatch = useRouteMatch('/blogs/:id')
  const blogToView = blogMatch
    ? blogs.find(b => b.id === blogMatch.params.id)
    : null

  return (
    <div className='container'>
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