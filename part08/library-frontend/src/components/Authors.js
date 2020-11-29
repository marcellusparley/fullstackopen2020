import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const resultAuthors = useQuery(ALL_AUTHORS)
  const [authorName, setAuthorName] = useState('')
  const [authorBorn, setAuthorBorn] = useState('')
  //const [authors, setAuthors] = useState([])
  const [changeAuthor] = useMutation(EDIT_AUTHOR, {
    //refetchQueries: [ {query: ALL_AUTHORS }],
    onError: (error) => {
      props.setError(error.toString())
    }
  })

  if (!props.show) {
    return null
  }

  if (resultAuthors.loading)
    return <div>Loading...</div>

  const authors = resultAuthors.data.allAuthors

  const submit = (event) => {
    event.preventDefault()

    changeAuthor({ variables: {
      name: authorName, setBornTo: parseInt(authorBorn)
    }})

    setAuthorBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Set Birthyear</h3>
      <form onSubmit={submit}>
        <select value={authorName}
          onChange={({ target }) => {setAuthorName(target.value)}}>

          <option disabled value=''>Select Author</option>

          {authors.map(a => 
            <option key={a.id} value={a.name}>{a.name}</option>)}

        </select>
        <label> Born
          <input type='number' value={authorBorn} 
            onChange={({ target }) => {setAuthorBorn(target.value)}} />
        </label>

        <button type='submit'>Update</button>
      </form>
    </div>
  )
}

export default Authors
