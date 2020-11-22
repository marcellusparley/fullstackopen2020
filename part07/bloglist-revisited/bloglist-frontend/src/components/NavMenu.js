import React from 'react'
import { Link } from 'react-router-dom'

const NavMenu = ({ user, handleLogout }) => {
  const padding = {
    padding: 5
  }

  return (
    <div>
      <Link style={padding} to='/'>Blogs</Link>
      <Link style={padding} to='/users'>Users</Link>
      {
        user
          ? <label>
            {user.name} Logged-in
            <button onClick={handleLogout}>Logout</button>
          </label>
          : <Link style={padding} to='/'>Login</Link>
      }

    </div>
  )
}

export default NavMenu