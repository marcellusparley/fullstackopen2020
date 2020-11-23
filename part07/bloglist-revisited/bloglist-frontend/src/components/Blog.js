//Displays each blog
import React from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  return (
    <div className='blogItem'>
      <Link to={`/blogs/${blog.id}`}>
        <b>{blog.title}</b> by {blog.author}
      </Link>
    </div>
  )
}

export default Blog
