import { buildQuery, ListParam, PaginatedResponse } from '@things-factory/graphql-utils'
import { Context } from 'koa'
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Privilege, Role } from '../../entities'
import { NewPrivilege, PrivilegePatch } from '../types'
import { Domain } from '@things-factory/domain-base'

const PaginatedPrivilegeResponse = PaginatedResponse(Privilege)
type PaginatedPrivilegeResponse = InstanceType<typeof PaginatedPrivilegeResponse>

@Service()
@Resolver(of => Privilege)
export class PrivilegeResolver {
  constructor(@InjectRepository(Privilege) private readonly privilegeRepository: Repository<Privilege>) {}
  @Query(returns => Privilege)
  async privilege(@Arg('name') name: string, @Ctx() context: Context & Record<string, any>) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    return Privilege.findOne({
      where: { domain: context.state.domainEntity, name }
    })
  }
  @Query(returns => PaginatedPrivilegeResponse)
  async privileges(@Args() params: ListParam, @Ctx() context: Context & Record<string, any>) {
    const queryBuilder = Privilege.createQueryBuilder()
    buildQuery(queryBuilder, params, context, false)
    const [items, total] = await queryBuilder.getManyAndCount()
    return { items, total }
  }
  @Mutation(returns => Privilege)
  async createPrivilege(@Arg('Privilege') privilege: NewPrivilege, @Ctx() context: Context & Record<string, any>) {
    const newPrivilege = new Privilege()
    Object.assign(newPrivilege, privilege)
    if (privilege.roles && privilege.roles.length) {
      newPrivilege.roles = await Role.findByIds(privilege.roles)
    }

    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    newPrivilege.domain = context.state.domainEntity
    newPrivilege.creator = context.state.user
    newPrivilege.updater = context.state.user

    return newPrivilege.save()
  }
  @Mutation(returns => [Privilege])
  async deletePrivilege(@Arg('name') name: string, @Ctx() context: Context & Record<string, any>) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    const findConds = { name, domain: context.state.domainEntity }
    const willDelete = Privilege.find(findConds)
    await Privilege.delete(findConds)
    return willDelete
  }
  @Mutation(returns => Privilege)
  async updatePrivilege(
    @Arg('name') name: string,
    @Arg('patch') patch: PrivilegePatch,
    @Ctx() context: Context & Record<string, any>
  ) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    const privilege = await Privilege.findOne({
      where: { domain: context.state.domainEntity, name },
      relations: ['roles']
    })

    const roleIds = privilege.roles.map(role => role.id)
    if (patch.roles && patch.roles.length) {
      patch.roles.forEach((roleId: string) => {
        if (!roleIds.includes(roleId)) {
          roleIds.push(roleId)
        }
      })
    }

    Object.assign(privilege, patch)
    privilege.roles = await Role.findByIds(roleIds)
    privilege.updater = context.state.user

    return privilege.save()
  }
  // @Mutation(returns => Privilege)
  // @Authorized()
  // addPrivilege(@Arg('newPrivilegeData') newPrivilegeData: NewPrivilegeInput, @Ctx('user') user: User): Promise<Privilege> {
  //   return this.PrivilegeService.addNew({ data: newPrivilegeData, user })
  // }
  // @Mutation(returns => Boolean)
  // @Authorized(Roles.Admin)
  // async removePrivilege(@Arg('id') id: string) {
  //   try {
  //     await this.PrivilegeService.removeById(id)
  //     return true
  //   } catch {
  //     return false
  //   }
  // }
}
