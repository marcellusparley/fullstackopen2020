import React from 'react'

// Component to display the current notification state (from App.js)

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return (
    <div className={notification.type}>{notification.message}</div>
  )
}

export default Notification