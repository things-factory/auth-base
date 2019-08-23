import { Appliance } from './appliance'
import { ApplianceList } from './appliance-list'
import { AppliancePatch } from './appliance-patch'
import { NewAppliance } from './new-appliance'

export const Mutation = `
  createAppliance (
    appliance: NewAppliance!
  ): Appliance

  updateAppliance (
    name: String!
    patch: AppliancePatch!
  ): Appliance

  deleteAppliance (
    name: String!
  ): Boolean
`

export const Query = `
  appliances(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ApplianceList
  appliance(name: String!): Appliance
`

export const Types = [Appliance, NewAppliance, AppliancePatch, ApplianceList]
