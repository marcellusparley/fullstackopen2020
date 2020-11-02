/* BlogForm component to display the form for adding blogs and
 * handling the api call through the blogService blogs.js. Handles
 * states for it's inputs
 * */
import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({ blogAppend, notifier }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogURL, setBlogURL] = useState('')
  //const [blogLikes, setBlogLikes] = useState(0)

  // Adds blog via the blog service and notifies the user via
  // notifier which updates the notification state in App.js
  const addBlog = async (event) => {
    event.preventDefault()

    const blog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogURL,
      //likes: Number(blogLikes)
    }

    try {
      const blogAdded = await blogService.create(blog)
      notifier(`Added new blog '${blogAdded.title}'`, 'success')

      // Passed in helper function to concat the returned blog
      blogAppend(blogAdded)
    } catch (err) {
      notifier(err.response.data.error, 'error')
    }
  }

  return (
    <form onSubmit={addBlog}>
      <label>Title:
        <input
          type="text"
          value={blogTitle}
          name="Title"
          onChange={({ target }) => setBlogTitle(target.value)}
        />
      </label>
      <label>Author:
        <input
          type="text"
          value={blogAuthor}
          name="Author"
          onChange={({ target }) => setBlogAuthor(target.value)}
        />
      </label>
      <label>URL:
        <input
          type="text"
          value={blogURL}
          name="URL"
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
      <button type="submit">Add Blog</button>
    </form>
  )
}

BlogForm.propTypes = {
  blogAppend: PropTypes.func.isRequired,
  notifier: PropTypes.func.isRequired
}

export default BlogForm