// Component for displaying information about a single Blog
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { likeBlog, commentBlog } from '../reducers/blogsReducer'
import { Button, Table, Form } from 'react-bootstrap'

const BlogView = ({ blog }) => {
  const dispatch = useDispatch()
  const usersInfo = useSelector(state => state.usersInfo)
  const [ newComment, setComment ] = useState('')

  // Only display if there is a blog to display, fixes bug when loading page
  if (!blog) return null

  // Gets the user for the specific blog
  const user = usersInfo.find(u => u.id === blog.user)

  // Handler for liking a blog
  const likeHandler = async (event) => {
    event.preventDefault()

    try {
      dispatch(likeBlog(blog))
      dispatch(setNotification({ message: `Liked '${blog.title}'`, type: 'success' }, 5))
    } catch (err) {
      dispatch(setNotification({ message: err.response.data.error, type: 'error' }, 5))
    }
  }

  // Handler for adding a comment
  const commentHandler = async (event) => {
    event.preventDefault()

    // Only submit if there is a comment in the field
    if (newComment === '' || newComment === null) return

    try {
      dispatch(commentBlog(blog, newComment))
      setComment('')
      dispatch(setNotification({ message: 'Commented on blog', type: 'success' }, 5))
    } catch (err) {
      dispatch(setNotification({ message: err.response.data.error, type: 'error' }, 5))
    }
  }

  const buttonMargin = {
    marginLeft: 10,
  }

  return (
    <div>
      <h2><b>{`"${blog.title}"`}</b> <i>by {blog.author}</i></h2>
      <h4><a href={blog.url}>{blog.url}</a></h4>
      <p>{user ? `Added by ${user.name}` : '' }</p>

      <label>
        Likes: {blog.likes}
        <Button style={buttonMargin} onClick={likeHandler} >Like</Button>
      </label>

      <h4>Comments</h4>

      <Form onSubmit={commentHandler}>
        <Form.Group>
          <Form.Control
            type='text'
            value={newComment}
            onChange={({ target }) => setComment(target.value)} />
          <Button type='submit'>Add Comment</Button>
        </Form.Group>
      </Form>

      <Table striped>
        <tbody>
          {blog.comments.map((comment, index) =>
            <tr key={index}><td>{comment}</td></tr>
          )}
        </tbody>
      </Table>

    </div>
  )
}

export default BlogView