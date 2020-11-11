const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

//Generates new id
const getId = () => (100000 * Math.random()).toFixed(0)

//Creates an object from the string anecdote
const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    //Finds the anecdote by id, updates its votecount, and then changes it 
    //in the list
    case 'VOTE':
      const id = action.data.id
      const anecdoteToVote = state.find(a => a.id === id)
      const changedAnecdote = { ...anecdoteToVote, 
        votes: anecdoteToVote.votes + 1 }
      return state.map(anec => anec.id !== id ? anec : changedAnecdote )
    
    //Adds the new anecdote
    case 'ADD':
      const newAnecdote = action.data.anecdote
      return [ ...state, asObject(newAnecdote) ]

    default:
      return state
  }
}

//action creator for voting
export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

//action creator for adding anecdotes
export const addAnecdote = (anecdote) => {
  return {
    type: 'ADD',
    data: { anecdote }
  }
}

export default reducer