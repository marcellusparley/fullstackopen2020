// Component for Navigation menu at top of application
import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

const NavMenu = ({ user, handleLogout }) => {
  const padding = {
    padding: 5
  }

  // Renders logout option if user is alread logged in
  const renderLogout = () => {
    return (
      <>
        <Link style={padding} onClick={handleLogout}>Logout</Link>
        ({user.name})
      </>
    )
  }

  return (
    <Navbar collapseOnSelect expand='lg' bg='light' variant='light'>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='mr-auto'>
          <Nav.Link href='#' as='span'>
            <Link style={padding} to='/'>Blogs</Link>
          </Nav.Link>
          <Nav.Link href='#' as='span'>
            <Link style={padding} to='/users'>Users</Link>
          </Nav.Link>
          <Nav.Link href='#' as='span'>
            {
              user
                ? renderLogout()
                : <Link style={padding} to='/'>Login</Link>
            }
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavMenu