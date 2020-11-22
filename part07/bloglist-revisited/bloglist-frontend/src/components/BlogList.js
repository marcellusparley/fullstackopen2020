import React from 'react'
import { useSelector } from 'react-redux'
import Blog from './Blog'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  // Helper function to sort blogs by likes
  const sortHelper = (a, b) => {
    return b.likes - a.likes
  }

  return (
    <div>
      <h2>Blogs</h2>
      <div id='blog-list'>
        {[...blogs].sort(sortHelper).map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
          />
        )}
      </div>
    </div>
  )
}

export default BlogList