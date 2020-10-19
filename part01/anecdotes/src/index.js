import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const MostVotes = ({anecdote}) => {
  return (
    <div>
      <h2>Top Voted Anecdote</h2>
      <p>{anecdotes[anecdote]}</p>
    </div>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));

  const nextAnecdote = () => {
    let randInt = Math.floor(Math.random() * (anecdotes.length-1));
    if (randInt === selected) 
      randInt = (selected + 1) % anecdotes.length;
    return setSelected(randInt);
  }

  const vote = () => {
    const pArr = [...points];
    pArr[selected]++;
    setPoints(pArr);
  }

  const top = () => {
    let result = 0;
    let max = 0;

    points.forEach((val, index) => {
      if (val > max) {
        max = val;
        result = index;
      }
    });

    return result;
  }

  return (
    <div>
      <h1>Anecdotes</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>Votes: {points[selected]}</p>
      <Button onClick={vote} text="Vote" />
      <Button onClick={nextAnecdote} text="Next" />
      <MostVotes anecdote={top()} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)