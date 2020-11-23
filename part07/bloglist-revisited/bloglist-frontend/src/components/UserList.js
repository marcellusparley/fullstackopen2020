// Component Displaying a list of users' information
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const UserList = () => {
  const usersInfo = useSelector(state => state.usersInfo)

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <tbody>
          <tr>
            <th>User</th>
            <th>Name</th>
            <th>#Blogs</th>
          </tr>
          {[...usersInfo].map(user =>
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>
                  {user.username}
                </Link>
              </td>
              <td>{user.name}</td>
              <td>
                {user.blogs.length}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default UserList