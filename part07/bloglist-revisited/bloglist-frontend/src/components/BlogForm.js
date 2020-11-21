/* BlogForm component to display the form for adding blogs and
 * handling the api call through the blogService blogs.js. Handles
 * states for it's inputs
 * */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogForm = () => {
  const dispatch = useDispatch()
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogURL, setBlogURL] = useState('')
  //const [blogLikes, setBlogLikes] = useState(0)

  // Adds blog via dispatch and notifies the user
  const addHandler = async (event) => {
    event.preventDefault()

    const blog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogURL,
      //likes: Number(blogLikes)
    }

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
    <form onSubmit={addHandler} className='blogForm'>
      <label>Title:
        <input
          type="text"
          value={blogTitle}
          name="Title"
          className="blogTitle"
          id='blog-title'
          onChange={({ target }) => setBlogTitle(target.value)}
        />
      </label>
      <label>Author:
        <input
          type="text"
          value={blogAuthor}
          name="Author"
          className='blogAuthor'
          id='blog-author'
          onChange={({ target }) => setBlogAuthor(target.value)}
        />
      </label>
      <label>URL:
        <input
          type="text"
          value={blogURL}
          name="URL"
          className='blogURL'
          id="blog-url"
          onChange={({ target }) => setBlogURL(target.value)}
        />
      </label>
      {/*
      <label>Likes:
        <input
          type="number"
          value={blogLikes}
          name="Likes"
          onChange={({ target }) => setBlogLikes(target.value)}
        />
      </label>
      */}
      <button type="submit" id="blog-submit" >Add Blog</button>
    </form>
  )
}

export default BlogForm