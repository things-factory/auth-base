import { Filter, Pagination, Sorting } from '@things-factory/shell'
import { NewPermitUrl } from './new-permit-url'
import { PermitUrl } from './permit-url'
import { PermitUrlList } from './permit-url-list'
import { PermitUrlPatch } from './permit-url-patch'

export const Mutation = `
  createPermitUrl (
    permitUrl: NewPermitUrl!
  ): PermitUrl

  updatePermitUrl (
    name: String!
    patch: PermitUrlPatch!
  ): PermitUrl

  deletePermitUrl (
    name: String!
  ): PermitUrl
`

export const Query = `
  permitUrls(filters: [Filter], pagination: Pagination, sortings: [Sorting]): PermitUrlList
  permitUrl(name: String!): PermitUrl
`

export const Types = [Filter, Pagination, Sorting, PermitUrl, NewPermitUrl, PermitUrlPatch, PermitUrlList]
