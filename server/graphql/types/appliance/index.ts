import { Appliance } from './appliance'
import { NewAppliance } from './new-appliance'
import { AppliancePatch } from './appliance-patch'
import { ApplianceList } from './appliance-list'
import { Filter, Pagination, Sorting } from '@things-factory/shell'

export const Mutation = `
  createAppliance (
    appliance: NewAppliance!
  ): Appliance

  updateAppliance (
    id: String!
    patch: AppliancePatch!
  ): Appliance

  deleteAppliance (
    id: String!
  ): Appliance

  publishAppliance (
    id: String!
  ): Appliance
`

export const Query = `
  appliances(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ApplianceList
  appliance(id: String!): Appliance
`

export const Types = [Filter, Pagination, Sorting, Appliance, NewAppliance, AppliancePatch, ApplianceList]
