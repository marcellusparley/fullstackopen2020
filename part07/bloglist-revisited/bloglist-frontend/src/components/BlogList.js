import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'
import Blog from './Blog'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()

  // Helper function to sort blogs by likes
  const sortHelper = (a, b) => {
    return b.likes - a.likes
  }

  // Helper sent to Blog for adding updated blog to list
  const likeHandler = async (updateBlog) => {
    try {
      dispatch(likeBlog(updateBlog))
      dispatch(setNotification({ message: `Liked '${updateBlog.title}'`, type: 'success' }, 5))
    } catch (err) {
      dispatch(setNotification({ message: err.response.data.error, type: 'error' }, 5))
    }
  }

  // Helper sent to Blog for removing from list
  const removeHandler = async (blog) => {
    if (window.confirm(`Do you really want to delete ${blog.name}?`)) {
      try {
        dispatch(removeBlog(blog))
        dispatch(setNotification({ message: `Deleted '${blog.title}'`, type: 'success' }, 5))
      } catch (err) {
        dispatch(setNotification({ message: err.response.data.error, type: 'error' }, 5))
      }
    }
  }

  return (
    <div>
      <h2>Blogs</h2>
      <div id='blog-list'>
        {[...blogs].sort(sortHelper).map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            liker={likeHandler}
            remover={removeHandler}
          />
        )}
      </div>
    </div>
  )
}

export default BlogList