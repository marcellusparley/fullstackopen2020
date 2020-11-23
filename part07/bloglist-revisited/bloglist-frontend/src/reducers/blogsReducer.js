// Reducer for blogs
import blogService from '../services/blogs'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT': {
    return action.data
  }
  case 'ADD': {
    const newBlog = action.data
    return [...state, newBlog]
  }
  case 'LIKE': {
    const likedBlog = action.data
    return [...state.filter(b => b.id !== likedBlog.id), likedBlog]
  }
  case 'REMOVE': {
    const removed = action.data
    return [...state].filter(b => b.id !== removed.id)
  }
  case 'COMMENT': {
    const commentedBlog = action.data
    return [...state.filter(b => b.id !== commentedBlog.id), commentedBlog]
  }
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT',
      data: blogs
    })
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.like(blog.id, { ...blog, likes: blog.likes + 1 })
    dispatch({
      type: 'LIKE',
      data: newBlog
    })
  }
}

export const commentBlog = (blog, comment) => {
  return async dispatch => {
    const newBlog = await blogService.comment(blog.id, { ...blog, comments: blog.comments.concat(comment) })
    dispatch({
      type: 'COMMENT',
      data: newBlog
    })
  }
}

export const addBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'ADD',
      data: newBlog
    })
  }
}

export const removeBlog = (blog) => {
  return async dispatch => {
    await blogService.deleteBlog(blog.id)
    dispatch({
      type: 'REMOVE',
      data: blog
    })
  }
}

export default reducer