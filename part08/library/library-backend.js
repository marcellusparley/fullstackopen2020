const { ApolloServer, UserInputError, 
  AuthenticationError, gql, PubSub } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const config = require('./utils/config')
const jwt = require('jsonwebtoken')

const pubsub = new PubSub()

console.log('connecting to Mongodb')

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, 
  useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB', error.message)
  })

const typeDefs = gql`
  type Subscription {
    bookAdded: Book!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    bookCount: Int!
    born: Int
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: [String]): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(username: String!, favoriteGenre: String!): User

    login(username: String!, password: String!): Token
  }
`
const resolvers = {

  Mutation: {

    // Resolver for creating user
    createUser: (root, args) => {
      const user = new User({ username: args.username,
        favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
    },

    // Resolver for logging in
    login: async (root, args) => {

      // Finds user, if doesn't exist throw error
      const user = await User.findOne({ username: args.username })
      if ( !user || args.password !== 'secret')
        throw new UserInputError("wrong credentials")

      // The user object that will be signed
      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.SECRET) }
    },

    // Resolver for adding books
    addBook: async (root, args, { currentUser }) => {

      // Gets user from context and checks that it exists
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      // Finds the author's information
      var author = await Author.findOne({ name: args.author })

      // If author isn't found tries to create them
      if (!author) {
        const newAuthor = new Author({ name: args.author })
        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs:args
          })
        }
      }

      // Tries creating the book
      let book = new Book({ ...args, author: author._id })
      try {
        await book.save()
        author.books = [ ...author.books, book._id ]
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs:args
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      book.author = author
      book.author.bookCount = book.author.books.length
      return book
    },

    // Resolver for changing an author's born year
    editAuthor: async (root, args, { currentUser }) => {
      
      // Checks credentials
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      // Finds the author and tries changing his born value
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs:args
        })
      }

      return author
    }
  },

  Query: {

    // Counts
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),

    // Get all books
    allBooks: async (root, args) => {

      // If there is args for both author name and/or genre finds only
      // matching authors, else it finds all books in db
      if (args.author && args.genres && args.genres.length > 0) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: author._id },
          { genre: { $in: args.genres }})
          .populate('author')

      } else if (args.author && (!args.genres || args.genres.length === 0)) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: author._id })
          .populate('author')

      } else if (args.genres && args.genres.length > 0)
        return Book.find({ genres: { $in: args.genres }})
          .populate('author')

      else 
        return Book.find({}).populate('author')
    },

    // Gets all authors
    allAuthors: () => Author.find({}).populate('books'),

    // Gets current user
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: (root) => {
      return root.books.length
    }
  },


  Book: {
    author: (root) => {
      return root.author
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)

      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})