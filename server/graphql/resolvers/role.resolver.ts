import { Domain } from '@things-factory/domain-base'
import { buildQuery, ListParam, PaginatedResponse } from '@things-factory/graphql-utils'
import { Context } from 'koa'
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Privilege, Role, User } from '../../entities'
import { NewRole, RolePatch } from '../types'

const PaginatedRoleResponse = PaginatedResponse(Role)
type PaginatedRoleResponse = InstanceType<typeof PaginatedRoleResponse>

@Service()
@Resolver(of => Role)
export class RoleResolver {
  @Query(returns => Role)
  async role(@Arg('name') name: string, @Ctx() context: Context & Record<string, any>) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    return Role.findOne({
      where: { domain: context.state.domainEntity, name },
      relations: ['users', 'privileges']
    })
  }
  @Query(returns => PaginatedRoleResponse)
  async roles(@Args() params: ListParam, @Ctx() context: Context & Record<string, any>) {
    const queryBuilder = Role.createQueryBuilder()
    buildQuery(queryBuilder, params, context, false)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Role.users', 'Users')
      .leftJoinAndSelect('Role.privileges', 'Privileges')
      .getManyAndCount()
    return { items, total }
  }
  @Mutation(returns => Role)
  async createRole(@Arg('Role') role: NewRole, @Ctx() context: Context & Record<string, any>) {
    const newRole = new Role()
    Object.assign(newRole, role)

    if (role.privileges && role.privileges.length) {
      newRole.privileges = await Privilege.findByIds(role.privileges.map(privilege => privilege.id))
    }

    if (role.users && role.users.length) {
      newRole.users = await User.findByIds(role.users.map(user => user.id))
    }

    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    newRole.domain = context.state.domainEntity
    newRole.creator = context.state.user
    newRole.updater = context.state.user

    return newRole.save()
  }
  @Mutation(returns => [Role])
  async deleteRole(@Arg('id') id: string, @Ctx() context: Context & Record<string, any>) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    const willDelete = await Role.findOne(id)
    return willDelete.remove()
  }
  @Mutation(returns => [Role])
  async deleteRoles(@Arg('id') ids: string[], @Ctx() context: Context & Record<string, any>) {
    const willDelete = await Role.findByIds(ids)
    return Role.remove(willDelete)
  }

  @Mutation(returns => Role)
  async updateRole(
    @Arg('id') id: string,
    @Arg('patch') patch: RolePatch,
    @Ctx() context: Context & Record<string, any>
  ) {
    const role = await Role.findOne({
      where: { id },
      relations: ['privileges']
    })

    const privilegeIds = role.privileges.map(privilege => privilege.id)
    if (patch.privileges && patch.privileges.length) {
      patch.privileges.forEach((privilegeId: string) => {
        if (!privilegeIds.includes(privilegeId)) {
          privilegeIds.push(privilegeId)
        }
      })
    }

    Object.assign(role, patch)
    role.privileges = await Privilege.findByIds(patch.privileges.map((privilege: Privilege) => privilege.id))
    role.updater = context.state.user

    return role.save()
  }

  @Query(returns => [Role])
  async rolePrivileges(@Arg('roleId') roleId: string, @Ctx() context: Context & Record<string, any>) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    const rolePrivileges = await Privilege.query(
      `
        SELECT
          id,
          name,
          category,
          description,
          CASE WHEN id IN (
            SELECT
              P.id
            FROM
              privileges P JOIN roles_privileges RP
            ON
              P.id = RP.privileges_id
            WHERE
              RP.roles_id = '${roleId}'
          ) THEN true
            ELSE false
          END AS assigned
        FROM
          privileges
        WHERE
            domain_id = '${context.state.domainEntity.id}'
      `
    )

    return rolePrivileges
  }

  @Query(returns => [Role])
  async userRoles(@Arg('userId') userId: string, @Ctx() context: Context & Record<string, any>) {
    const userRoles = await Role.query(
      `
        SELECT
          id,
          name,
          description,
          CASE WHEN id IN (
            SELECT
              R.id
            FROM
              roles R JOIN users_roles UR
            ON
              R.id = UR.roles_id
            WHERE
              UR.users_id = '${userId}'
          ) THEN true
            ELSE false
          END AS assigned
        FROM
          roles
      `
    )

    return userRoles
  }

  // @Mutation(returns => Role)
  // @Authorized()
  // addRole(@Arg('newRoleData') newRoleData: NewRoleInput, @Ctx('user') user: User): Promise<Role> {
  //   return this.RoleService.addNew({ data: newRoleData, user })
  // }
  // @Mutation(returns => Boolean)
  // @Authorized(Roles.Admin)
  // async removeRole(@Arg('id') id: string) {
  //   try {
  //     await this.RoleService.removeById(id)
  //     return true
  //   } catch {
  //     return false
  //   }
  // }
}
