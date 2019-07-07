import { priviledgeResolver } from './priviledge'
import { priviledgesResolver } from './priviledges'

import { updatePriviledge } from './update-priviledge'
import { createPriviledge } from './create-priviledge'
import { deletePriviledge } from './delete-priviledge'

import { directivePriviledge } from './directive-priviledge'

export const Query = {
  ...priviledgesResolver,
  ...priviledgeResolver
}

export const Mutation = {
  ...updatePriviledge,
  ...createPriviledge,
  ...deletePriviledge
}

export const Directive = {
  ...directivePriviledge
}
