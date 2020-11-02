//Displays each blog
import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, liker, notifier, remover }) => {
  const [infoVisible, setInfoVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // Function for hiding the div depending on the infoVisible state
  const hideStyle = () => {
    if (infoVisible)
      return { display: '' }
    else
      return { display: 'none' }
  }

  // Change state
  const toggleVisibility = () => {
    setInfoVisible(!infoVisible)
  }

  // Function for changing the button label based on state
  const toggleLabel = () => {
    if (infoVisible)
      return 'Hide'
    else
      return 'Show'
  }

  // Call to update blog via blogs service
  const updateBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      ...blog,
      likes: blog.likes+1
    }

    try {
      const blogAdded = await blogService.update(blog.id, newBlog)
      notifier(`Liked '${blogAdded.title}'`, 'success')

      // Passed in helper function to concat the returned blog
      liker(blogAdded)
    } catch (err) {
      notifier(err.response.data.error, 'error')
    }
  }

  // Call to blog service to remove blog from db
  const removeBlog = async (event) => {
    event.preventDefault()

    if (window.confirm(`Do you really want to delete ${blog.name}?`)) {
      try {
        await blogService.deleteBlog(blog.id)
        notifier(`Deleted '${blog.title}'`, 'success')

        // Passed in helper function to remove blog from list
        remover(blog.id)
      } catch (err) {
        notifier(err.response.data.error, 'error')
      }
    }
  }

  return (
    <div style={blogStyle}>
      <label>
        <b>{blog.title}</b> by {blog.author}
        <button onClick={toggleVisibility}>{toggleLabel()}</button>
      </label>
      <div style={hideStyle()}>
        <p>{blog.url}</p>
        <label>
          Likes: {blog.likes}
          <button onClick={updateBlog}>Like</button>
        </label>
        <button onClick={removeBlog}>Delete</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  liker: PropTypes.func.isRequired,
  notifier: PropTypes.func.isRequired,
  remover: PropTypes.func.isRequired
}

export default Blog
