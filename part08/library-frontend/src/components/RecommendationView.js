import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS_GENRE, MY_FAV } from '../queries'

const RecommendationView = (props) => {
  const [books, setBooks] = useState([])
  const resultFav = useQuery(MY_FAV)
  const [getBooks, resultBooks] = useLazyQuery(ALL_BOOKS_GENRE)

  useEffect(() => {
    if (resultFav.data)
      getBooks({ variables: { genres: [resultFav.data.me.favoriteGenre]}})
  }, [resultFav.data, getBooks])

  useEffect(() => {
    if (resultBooks.data)
      setBooks(resultBooks.data.allBooks)
  }, [resultBooks.data])

  if (!props.show)
    return null

  if (resultFav.loading)
    return <div>LOADING</div>

  const fav = resultFav.data.me.favoriteGenre

  return (
    <div>
      <h2>Recommendations</h2>
      <p>{`Books in your favorite genre ${fav}`}</p>


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
          {books.map(a =>
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RecommendationView