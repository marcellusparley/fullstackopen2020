//Displays each blog
import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, liker, remover }) => {
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
  const updateBlog = (event) => {
    event.preventDefault()
    liker(blog)
  }

  // Call to blog service to remove blog from db
  const removeBlog = async (event) => {
    event.preventDefault()
    remover(blog)
  }

  return (
    <div style={blogStyle} className='blogItem'>
      <label>
        <b>{blog.title}</b> by {blog.author}
        <button onClick={toggleVisibility} className='toggleButton'>
          {toggleLabel()}
        </button>
      </label>
      <div style={hideStyle()} className="hidableBlogInfo">
        <p>{blog.url}</p>
        <label>
          Likes: {blog.likes}
          <button onClick={updateBlog} className='likeButton'>Like</button>
        </label>
        <button onClick={removeBlog}>Delete</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  liker: PropTypes.func.isRequired,
  remover: PropTypes.func.isRequired
}

export default Blog
