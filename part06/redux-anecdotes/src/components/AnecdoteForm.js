import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

/* Anecdote form for adding new entries to redux state */
const AnecdoteForm = () => {
  const dispatch = useDispatch()

  // Gets the new entry from input, clears the input, and uses the action
  // creator addAnecdote for the dispatch
  const add = async (e) => {
    e.preventDefault()
    console.log('add', e.target.anecdote.value )

    const content = e.target.anecdote.value
    e.target.anecdote.value = ''

    dispatch(addAnecdote(content))

    dispatch(setNotification(`You created anecdote '${content}'`, 5))
  }

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={add}>
        <div><input name='anecdote' /></div>
        <button>Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm