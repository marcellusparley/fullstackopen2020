import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UserList = () => {
  const usersInfo = useSelector(state => state.usersInfo)

  return (
    <div>
      <h2>Users</h2>
      <div>
        {
          [...usersInfo].map(user =>
            <div key={user.id}>
              <Link to={`/users/${user.id}`}>
                {user.username} - {user.name}
              </Link>
              {user.blogs.length}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default UserList