import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

/* Anecdote list displays the anecdotes sorted by votes, and handles updating
 * their vote counts when button is pressed */
const AnecdoteList = (props) => {

  // Handler for button, dispatches actions to like the anecdote, 
  // and set and display notification for 5 secs
  const vote = (anecdote) => {
    props.voteAnecdote(anecdote)
    props.setNotification(`You voted for '${anecdote.content}'`, 5)
  }

  // Helper function for sorting the list
  const sorted = (anecdotes) => {
    return [...anecdotes].sort((a,b) => {
      return b.votes - a.votes
    })
  }

  return (
    <div>
      {sorted(props.anecdotes).map(anecdote =>
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

const mapStateToProps = (state) => {
  const filterer = (anecdote) => {
    return anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
  }

  return {
    anecdotes: state.anecdotes.filter(filterer)
  }
}

const mapDispatchToProps = {
  setNotification,
  voteAnecdote
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList