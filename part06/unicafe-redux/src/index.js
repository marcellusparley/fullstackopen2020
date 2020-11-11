import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const good = () => {
    store.dispatch({
      type: 'GOOD'
    })
  }

  const ok = () => {
    store.dispatch({
      type: 'OK'
    })
  }

  const bad = () => {
    store.dispatch({
      type: 'BAD'
    })
  }

  const zero = () => {
    store.dispatch({
      type: 'ZERO'
    })
  }

  const total = (state) => {
    return state.good + state.ok + state.bad
  }

  const avg = (state) => {
    return (state.good - state.bad) / total(state)
  }

  const percent = (state) => {
    return (state.good / total(state)) * 100
  }
  
  return (
    <div>
      <button onClick={good}>Good</button> 
      <button onClick={ok}>Neutral</button> 
      <button onClick={bad}>Bad</button>
      <button onClick={zero}>Reset stats</button>
      <div>Good {store.getState().good}</div>
      <div>Neutral {store.getState().ok}</div>
      <div>Bad {store.getState().bad}</div>
      <div>Total {total(store.getState())}</div>
      <div>Average {avg(store.getState())}</div>
      <div>Positive {percent(store.getState())}</div>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
