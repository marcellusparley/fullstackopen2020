import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { likeBlog } from '../reducers/blogsReducer'

const BlogView = ({ blog }) => {
  const dispatch = useDispatch()
  const usersInfo = useSelector(state => state.usersInfo)

  if (!blog) return null

  const user = usersInfo.find(u => u.id === blog.user)

  const likeHandler = async (event) => {
    event.preventDefault()

    try {
      dispatch(likeBlog(blog))
      dispatch(setNotification({ message: `Liked '${blog.title}'`, type: 'success' }, 5))
    } catch (err) {
      dispatch(setNotification({ message: err.response.data.error, type: 'error' }, 5))
    }
  }

  return (
    <div>
      <h3><b>{blog.title}</b> by {blog.author}</h3>

      <a href={blog.url}>{blog.url}</a>
      <label className='likes-label' >
        Likes: {blog.likes}
        <button onClick={likeHandler} className='likeButton'>Like</button>
      </label>

      <p>{user ? `Added by ${user.name}` : '' }</p>

    </div>
  )
}

export default BlogView