import { applianceResolver } from './appliance'
import { appliancesResolver } from './appliances'

import { updateAppliance } from './update-appliance'
import { createAppliance } from './create-appliance'
import { deleteAppliance } from './delete-appliance'

export const Query = {
  ...appliancesResolver,
  ...applianceResolver
}

export const Mutation = {
  ...updateAppliance,
  ...createAppliance,
  ...deleteAppliance
}
