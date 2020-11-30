import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  title
  published
  genres
  author {
    name
    born
    id
  }
  id
}
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    ...BookDetails
  }
}

${BOOK_DETAILS}
`

export const ALL_BOOKS_GENRE = gql`
query booksByGenre($genres: [String]) {
  allBooks(genres: $genres) {
    ...BookDetails
  }
}

${BOOK_DETAILS}
`

export const MY_FAV = gql`
query {
  me {
    favoriteGenre
  }
}
`

export const CREATE_BOOK = gql`
mutation createBook(
  $title: String!, $published: Int!, $author: String!, $genres: [String!]!
) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ) {
    ...BookDetails
  }
}

${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
    id
  }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    title
    published
    author {
      name
      born
      bookCount
      id
    }
    genres
    id
  }
}
`