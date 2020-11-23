// Component that displays a specific user's added blogs
import React from 'react'
import { Table } from 'react-bootstrap'

const UserView = ({ user }) => {
  if (!user) return null

  return (
    <div>
      <h2>{user.username}</h2>
      <Table>
        <tbody>
          <tr><th>Added Blogs</th></tr>
          {user.blogs.map(blog =>
            <tr key={blog.id}><td>{blog.title}</td></tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default UserView