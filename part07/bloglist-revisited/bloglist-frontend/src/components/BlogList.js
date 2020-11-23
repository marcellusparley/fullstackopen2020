// Displays a table listing all the blogs in the state
import React from 'react'
import { useSelector } from 'react-redux'
import Blog from './Blog'
import { Table } from 'react-bootstrap'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  // Helper function to sort blogs by likes
  const sortHelper = (a, b) => {
    return b.likes - a.likes
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Table striped>
        <tbody>
          {[...blogs].sort(sortHelper).map(blog =>
            <tr key={blog.id}>
              <td>
                <Blog
                  key={blog.id}
                  blog={blog}
                />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default BlogList