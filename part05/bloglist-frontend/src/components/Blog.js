//Displays each blog
import React from 'react'

const Blog = ({ blog }) => (
  <div>
    <p><b>{blog.title}</b> by {blog.author}</p>
  </div>
)

export default Blog
