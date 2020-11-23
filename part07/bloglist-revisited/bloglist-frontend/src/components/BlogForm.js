// BlogForm component to display the form for adding blogs and
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'

const BlogForm = () => {
  const dispatch = useDispatch()
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogURL, setBlogURL] = useState('')

  // Adds blog and notifies the user
  const addHandler = async (event) => {
    event.preventDefault()

    const blog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogURL,
    }

    // Clear the input fields
    setBlogTitle('')
    setBlogAuthor('')
    setBlogURL('')

    try {
      await dispatch(addBlog(blog))
      dispatch(setNotification({ message: `Added blog '${blog.title}'`, type: 'success' }, 5))
    } catch (err) {
      console.log(err)
      dispatch(setNotification({ message: 'Something went wrong', type: 'error' }, 5))
    }
  }

  return (
    <Form onSubmit={addHandler} >
      <Form.Group>
        <Form.Label>Title:</Form.Label>
        <Form.Control
          type="text"
          value={blogTitle}
          name="Title"
          className="blogTitle"
          id='blog-title'
          onChange={({ target }) => setBlogTitle(target.value)}
        />
        <Form.Label>Author:</Form.Label>
        <Form.Control
          type="text"
          value={blogAuthor}
          name="Author"
          className='blogAuthor'
          id='blog-author'
          onChange={({ target }) => setBlogAuthor(target.value)}
        />
        <Form.Label>URL:</Form.Label>
        <Form.Control
          type="text"
          value={blogURL}
          name="URL"
          className='blogURL'
          id="blog-url"
          onChange={({ target }) => setBlogURL(target.value)}
        />
        <Button variant='primary' type="submit" id="blog-submit" >Add Blog</Button>
      </Form.Group>
    </Form>
  )
}

export default BlogForm