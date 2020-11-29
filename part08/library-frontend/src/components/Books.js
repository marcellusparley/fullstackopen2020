import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filterList, setFilters] = useState([])
  const [genreFilter, setGenreFilter] = useState('')
  const [books, setBooks] = useState([])
  const result = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (result.data)
      setBooks(result.data.allBooks)
  }, [result.data])

  if (!props.show) {
    return null
  }

  const filterer = (book) => {
    if (filterList.length > 0)
      return book.genres.some(b => filterList.indexOf(b) !== -1)
    else
      return true
  }

  const resultTable = () => {
    if (result.loading)
      return <div>Loading...</div>
    else {
      return (
        <>
          <table>
            <tbody>
              <tr>
                <th>
                  Title
                </th>
                <th>
                  Author
                </th>
                <th>
                  Published
                </th>
              </tr>
              {books
                .filter(filterer)
                .map(b =>
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.author.name}</td>
                  <td>{b.published}</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )
    }
  }


  const removeFilter = (filter) => {
    setFilters(filterList.filter(g => g !== filter))
    console.log(filterList)
  }

  const addFilter = (event) => {
    event.preventDefault()
    setFilters(filterList.concat(genreFilter))
    console.log(filterList)
    setGenreFilter('')
  }

  return (
    <div>
      <h2>Books</h2>

      {resultTable()}

      <form onSubmit={addFilter}>
        <input type='text' value={genreFilter} 
          placeholder='Filter by genre'
          onChange={(e) => setGenreFilter(e.target.value)} />
        <button type='submit'>Add Filter</button>
      </form>

      {(filterList.length !== 0) &&
      <div>
        Filters:
        {filterList.map(f =>
          <button key={f} onClick={() => removeFilter(f)}>{f}</button>
        )}
      </div>
      }
    </div>
  )
}

export default Books