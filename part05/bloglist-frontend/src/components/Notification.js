import React from 'react'
//import PropTypes from 'prop-types'

// Component to display the current notification state (from App.js)

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <div className={notification.type}>{notification.message}</div>
  )
}

/* Will fail because I set no message to being null
Notification.propTypes = {
  notification: PropTypes.object.isRequired
}
*/

export default Notification