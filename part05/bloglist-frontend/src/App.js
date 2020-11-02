import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import './App.css'

/* App is the main component
 * Blog is the component that displays each blog
 * BlogForm displays when user is logged in. It handles the form for adding
 * new Blogs to the database. It handles the states for its own inputs.
 * LoginForm only shows when user is not logged in. Allows user to login. It
 * handles the states for it's inputs.
 * Notification displays messages to user controlled by notification state
 * Togglable is a component that allows the hiding and showing of it's children
 * blogService handles adding blogs and manages the token.
 * */
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  // Helper function to sort blogs by likes
  const sortHelper = (a, b) => {
    return b.likes - a.likes
  }

  // Get initial blogs state
  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs.sort(sortHelper) )
    })
  }, [])

  // Get token from local storage if it exists
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Handler for logging out
  const handleLogout = async (event) => {
    event.preventDefault()

    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
    notify('Logged out', 'success')
  }

  // Helper sent to BlogForm for adding new blog to list
  const blogAppend = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    setBlogs(blogs.concat(newBlog).sort(sortHelper))
  }

  // Helper sent to Blog for adding updated blog to list
  const likeBlog = (updatedBlog) => {
    const newBlogs = blogs.filter(b => b.id !== updatedBlog.id)
    setBlogs(newBlogs.concat(updatedBlog).sort(sortHelper))
  }

  // Helper sent to Blog for removing from list
  const removeBlog = (id) => {
    setBlogs( blogs.filter(b => b.id !== id) )
  }

  // The notify helper, passed to BlogForm and LoginForm
  const notify = (message, mtype) => {
    setNotification(
      {
        message: message,
        type: mtype
      }
    )

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // Following two functions just to make things compact
  const loginForm = () => {
    return (
      <LoginForm userChange={setUser}
        // setToken={blogService.setToken}
        notifier={notify}
      />
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
          <BlogForm notifier={notify} blogAppend={blogAppend} />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h1>Blog App</h1>

      <Notification notification={notification} />

      {user === null ? loginForm() : blogForm() }

      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          liker={likeBlog}
          notifier={notify}
          remover={removeBlog}
        />
      )}
    </div>
  )
}

export default App