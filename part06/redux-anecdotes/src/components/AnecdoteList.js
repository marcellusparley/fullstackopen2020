import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

/* Anecdote list displays the anecdotes sorted by votes, and handles updating
 * their vote counts when button is pressed */
const AnecdoteList = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  // Handler for button, dispatches action creaded by voteAnecdote
  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id))
  }

  // Helper function for sorting the list
  const sorted = (anecdotes) => {
    return [...anecdotes].sort((a,b) => {
      return b.votes - a.votes
    })
  }

  return (
    <div>
      {sorted(anecdotes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList