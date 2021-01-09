const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } = require('graphql');

const app = express();

const authors = [
  { id: 1, name: 'Daniel Nguyen' },
  { id: 2, name: 'Tracy Nguyen' },
  { id: 3, name: 'Kenny Nguyen' }
]
const books = [
  { id: 1, name: 'Mac Biet', authorId: 1 },
  { id: 2, name: 'Chiec luoc nga', authorId: 1 },
  { id: 3, name: 'Kinh van hoa', authorId: 1 },
  { id: 4, name: 'Cho toi xin mot ve di tuoi tho', authorId: 2 },
  { id: 5, name: 'Co gai den tu hom qua', authorId: 2 },
  { id: 6, name: 'Toi thay hoa vang tren co xanh', authorId: 2 },
  { id: 7, name: 'Di qua hoa cuc', authorId: 3 },
  { id: 8, name: 'Thien than nho cua toi', authorId: 3 }
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: { 
      type: AuthorType,
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an Author information',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt)},
    name: { type: GraphQLNonNull(GraphQLString)},
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A single book',
      args: { 
        id: {type: GraphQLInt}
       },
      resolve: (parent, args) => {
        return books.find(book => book.id === args.id)
      }
    },
    author: {
      type: AuthorType,
      description: 'A single author',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => {
        return authors.find(author => author.id === args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of all books',
      resolve: () => books
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of all authors',
      resolve: () => authors
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a new book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString)},
        authorId: { type: GraphQLNonNull(GraphQLInt)}
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId
        }
        books.push(book);
        return book
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add a new author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString)}
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name
        }
        authors.push(author);
        return author;
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))
app.listen(5000, () => console.log('server is runnung...'))