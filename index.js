const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
    allAuthors: [AuthorQuery!]!
    allBooks(title: String, genre: [String], author: String, published: Int): [Book!]!
  }

  type AuthorQuery {
    name: String!, born: Int, bookCount: Int!
  }
  type AuthorMutation {
    name: String!, born: Int
  }
    
  type Book {
    title: String!
    author: AuthorMutation!
    published: Int!
    genres: [String!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    
    addAuthor(
      name: String!
      born: Int
    ): AuthorMutation

    editAuthor(
      name: String!
      setBornTo: Int!
    ): AuthorMutation
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(), //books.length,
    authorCount: async () => Author.countDocuments(), //authors.length,
    allAuthors: async () => {
      const authors = await Author.find({})
      return Promise.all(authors.map(async (author) => {
        const bookCount = await Book.countDocuments({ author: author._id })
    
        return {
          ...author.toObject(),
          bookCount
        }
      }))
    },
    allBooks: async (root, args) => {
      let query = {}
    
      if (args.genre) {
        query.genres = { $in: args.genre }
      }
    
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        query.author = author._id
      }
    
      if (args.title) {
        query.title = { $regex: args.title, $options: "i" }
      }
    
      const books = await Book.find(query)
      return Promise.all(books.map(async (book) => {
        const author = await Author.findOne({ _id: book.author })

        return {
          ...book.toObject(),
          author: author
        }
      }))
    }    
  },
  AuthorQuery: {
    bookCount: async (author) => {
      return await Book.countDocuments({ author: author._id })
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      if (args.title.length < 4) {
        console.log(args.title)
        throw new GraphQLError(`The title ${args.title} is too short, minimum length is 4`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      const existingBook = await Author.findOne({ title: args.title })
      if (existingBook) {
        throw new GraphQLError('Title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      try {
        let bookAuthor = await Author.findOne({ name: args.author })
        if (!bookAuthor) {
          bookAuthor = new Author({ name: args.author })
          await newAuthor.save()
        }

        const book = new Book({ ...args, author: bookAuthor })
        await book.save()

        return book
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    addAuthor: async (root, args) => {
      if (args.name.length < 4) {
        throw new GraphQLError(`The name ${args.name} is too short, minimum length is 4`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      const existingAuthor = await Author.findOne({ name: args.name })
      if (existingAuthor) {
        throw new GraphQLError(`The name ${args.name} is not unique`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      
      const author = new Author({ ...args })
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return author
    },
    editAuthor: async (root, args) => {
      const existingAuthor = await Author.findOne({ name: args.name })
      if (!existingAuthor) {
        return null
      }
      existingAuthor.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Editing author born year failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return author
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})  

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Servidor correndo para a url ${url}`)
})