import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

const Rendered = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

ReactDOM.render(<Rendered />, document.getElementById('root'))