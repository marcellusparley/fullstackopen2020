import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import RecommendationView from './components/RecommendationView'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  // Get token from local storage if it exists
  useEffect(() => {
    const userToken = window.localStorage.getItem('library-user-token')
    if (userToken) {
      setToken(userToken)
    }
  }, [])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <Notification errorMessage={errorMessage} />

      <div>
        <button onClick={() => setPage('authors')}>Authors</button>
        <button onClick={() => setPage('books')}>Books</button>
        {token &&
          <button onClick={() => setPage('add')}>Add book</button>}
        {token &&
          <button onClick={() => setPage('recs')}>Recommendations</button>}
        {!token && 
          <button onClick={() => setPage('login')}>Login</button>}
        {token &&
          <button onClick={logout}>logout</button>}
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        setError={notify}
      />

      <LoginForm
        show={page === 'login'}
        setError={notify} 
        setToken={setToken}
      />

      <RecommendationView
        show={page === 'recs'}
        setError={notify}
        setToken={setToken}
      />

    </div>
  )
}

const Notification = ({errorMessage}) => {
  if (!errorMessage) {
    return null
  }

  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

export default App