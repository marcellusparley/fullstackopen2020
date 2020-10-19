import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const Statistic = ({name, value, unit}) => (
  <tr>
    <td>{name}</td>
    <td>{value} {unit}</td>
  </tr>
);

const Statistics = ({good, neutral, bad}) => {

  if (good === 0 && neutral === 0 && bad === 0) {
    return (
    <>
      <h1>Statistics</h1>
      <p>No feedback given</p>
    </>
    )
  }

  const total = good + bad + neutral;
  const avg = ((good * 1) + (bad * -1)) / total;
  const percentPos = (good / total) * 100;

  return (
    <>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <Statistic name='good' value={good} />
          <Statistic name='neutral' value={neutral} />
          <Statistic name='bad' value={bad} />
          <Statistic name='total' value={total} />
          <Statistic name='average' value={avg} />
          <Statistic name='positive' value={percentPos} unit='%' />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={() => {setGood(good+1)}} text='Good' />
      <Button onClick={() => {setNeutral(neutral+1)}} text='Neutral' />
      <Button onClick={() => {setBad(bad+1)}} text='Bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)