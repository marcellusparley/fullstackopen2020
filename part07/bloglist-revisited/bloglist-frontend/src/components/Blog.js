//Displays each blog
import React from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blogItem'>
      <Link to={`/blogs/${blog.id}`}>
        <b>{blog.title}</b> by {blog.author}
      </Link>
    </div>
  )
}

export default Blog
