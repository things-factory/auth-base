import * as User from './user'

export const resolvers = {
  Query: {
    ...User.Query
  },

  Mutation: {
    ...User.Mutation
  }
}
