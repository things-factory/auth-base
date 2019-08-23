import { NewUserHistory } from './new-user-history'
import { UserHistory } from './user-history'
import { UserHistoryList } from './user-history-list'
import { UserHistoryPatch } from './user-history-patch'

export const Mutation = `
  createUserHistory (
    userHistory: NewUserHistory!
  ): UserHistory

  updateUserHistory (
    id: String!
    patch: UserHistoryPatch!
  ): UserHistory

  deleteUserHistory (
    id: String!
  ): Boolean
`

export const Query = `
  userHistories(filters: [Filter], pagination: Pagination, sortings: [Sorting]): UserHistoryList
  userHistory(id: String!): UserHistory
`

export const Types = [UserHistory, NewUserHistory, UserHistoryPatch, UserHistoryList]
