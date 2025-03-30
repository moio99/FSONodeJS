const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
    userCount: Int!
    allAuthors: [AuthorQuery!]!
    allBooks(title: String, genre: [String], author: String, published: Int): [Book!]!
    me: User
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

    deleteBook(title: String!): Boolean
    
    addAuthor(
      name: String!
      born: Int
    ): AuthorMutation

    editAuthor(
      name: String!
      setBornTo: Int!
    ): AuthorMutation

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
    favoriteGenre: String!
  }

  type Subscription {
    bookAdded: Book!
  } 
`
module.exports = typeDefs