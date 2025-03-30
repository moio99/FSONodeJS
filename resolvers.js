const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const jwt = require('jsonwebtoken')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(), //books.length,
    authorCount: async () => Author.countDocuments(), //authors.length,
    userCount: async () => User.countDocuments(),
    me: (root, args, context) => {
      return context.currentUser
    },
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
    addBook: async (root, args, context) => {
      console.log('addBook')
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      if (args.title.length < 4) {
        console.log(args.title)
        throw new GraphQLError(`The title ${args.title} is too short, minimum length is 4`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      const existingBook = await Book.findOne({ title: args.title })
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

        pubsub.publish('BOOK_ADDED', { bookAdded: book })

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
    deleteBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
    
      const book = await Book.findOne({ title: args.title })
      if (!book) {
        throw new GraphQLError('Book not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }
    
      try {
        await Book.deleteOne({ title: args.title })
        return true
      } catch (error) {
        throw new GraphQLError('Error deleting book', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
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
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const existingAuthor = await Author.findOne({ name: args.name })
      if (!existingAuthor) {
        return null
      }
      existingAuthor.born = args.setBornTo
      try {
        await existingAuthor.save()
      } catch (error) {
        throw new GraphQLError('Editing author born year failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return existingAuthor
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      if (args.username.length < 4) {
        console.log(args.username)
        throw new GraphQLError(`The username ${args.username} is too short, minimum length is 4`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      const existingUser = await User.findOne({ username: args.username })
      if (existingUser) {
        throw new GraphQLError('The Username must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username
          }
        })
      }
        
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args, context) => {
      const user = await User.findOne({ username: args.username })
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      context.currentUser = user
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET), favoriteGenre: user.favoriteGenre }
    }
  },
  Subscription: {
    bookAdded: {
      // subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
      subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED'])
    },
  },
}

module.exports = resolvers