import { Filter, Pagination, Sorting } from '@things-factory/shell'
import { NewPriviledge } from './new-priviledge'
import { Priviledge } from './priviledge'
import { PriviledgeList } from './priviledge-list'
import { PriviledgePatch } from './priviledge-patch'

export const Mutation = `
  createPriviledge (
    priviledge: NewPriviledge!
  ): Priviledge

  updatePriviledge (
    id: String!
    patch: PriviledgePatch!
  ): Priviledge

  deletePriviledge (
    id: String!
  ): Priviledge

  publishPriviledge (
    id: String!
  ): Priviledge
`

export const Query = `
  priviledges(filters: [Filter], pagination: Pagination, sortings: [Sorting]): PriviledgeList
  priviledge(id: String!): Priviledge
`

export const Types = [Filter, Pagination, Sorting, Priviledge, NewPriviledge, PriviledgePatch, PriviledgeList]