import * as User from './user'

const Query = ['type Query {', User.Query, '}'].join('\n')

const Mutation = ['type Mutation {', User.Mutation, '}'].join('\n')

export const typeDefs = [
  `
    schema {
      query: Query
      mutation: Mutation
    }
  `,
  Query,
  Mutation,

  ...User.Types
]
