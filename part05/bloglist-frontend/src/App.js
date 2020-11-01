import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
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
 * blogService handles adding blogs and manages the token.
 * */
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  // Get initial blogs state
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
    setBlogs(blogs.concat(newBlog))
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
      setNotification(null);
    }, 5000)
  }

  // Following two functions just to make things compact
  const loginForm = () => {
    return (
      <LoginForm userChange={setUser} 
        setToken={blogService.setToken} 
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
        <BlogForm notifier={notify} blogAppend={blogAppend} />
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
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App