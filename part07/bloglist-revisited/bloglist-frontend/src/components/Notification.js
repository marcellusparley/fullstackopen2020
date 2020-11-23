// Component to display the current notification state
import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  // Helper for tranlating my notification to the Bootstrap variant
  const noteType = (t) => {
    if (t === 'success')
      return t
    else
      return 'danger'
  }

  return (
    <>
      {notification &&
        <Alert variant={noteType(notification.type)}>{notification.message}</Alert>
      }
    </>
  )
}

export default Notification