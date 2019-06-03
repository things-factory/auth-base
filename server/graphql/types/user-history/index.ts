import { Filter, Pagination, Sorting } from '@things-factory/shell'
import { NewUserHistory } from './new-user-history'
import { UserHistory } from './user-history'
import { UserHistoryList } from './user-history-list'
import { UserHistoryPatch } from './user-history-patch'

export const Mutation = `
  createUserHistory (
    userHistory: NewUserHistory!
  ): UserHistory

  updateUserHistory (
    name: String!
    patch: UserHistoryPatch!
  ): UserHistory

  deleteUserHistory (
    name: String!
  ): UserHistory
`

export const Query = `
  userHistories(filters: [Filter], pagination: Pagination, sortings: [Sorting]): UserHistoryList
  userHistory(name: String!): UserHistory
`

export const Types = [Filter, Pagination, Sorting, UserHistory, NewUserHistory, UserHistoryPatch, UserHistoryList]
