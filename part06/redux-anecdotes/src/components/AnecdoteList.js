import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

/* Anecdote list displays the anecdotes sorted by votes, and handles updating
 * their vote counts when button is pressed */
const AnecdoteList = () => {

  // Selector for anecdotes automatically applies the current filter
  const anecdotes = useSelector( ({ anecdotes, filter }) => {
    const filterer = (anecdote) => {
      return anecdote.content.toLowerCase().includes(filter.toLowerCase())
    }

    return anecdotes.filter(filterer)
  })

  const dispatch = useDispatch()

  // Handler for button, dispatches actions to like the anecdote, 
  // and set and display notification for 5 secs
  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`You voted for '${anecdote.content}'`, 5))
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
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList