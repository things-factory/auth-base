import { userResolver } from './user'
import { usersResolver } from './users'

import { updateMultipleUser } from './update-multiple-user'
import { updateUser } from './update-user'
import { createUser } from './create-user'
import { deleteUser } from './delete-user'
import { deleteUsers } from './delete-users'

export const Query = {
  ...usersResolver,
  ...userResolver
}

export const Mutation = {
  ...updateUser,
  ...updateMultipleUser,
  ...createUser,
  ...deleteUser,
  ...deleteUsers
}
