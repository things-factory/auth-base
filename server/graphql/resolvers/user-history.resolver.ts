import { Domain } from '@things-factory/domain-base'
import { buildQuery, ListParam, PaginatedResponse } from '@things-factory/graphql-utils'
import { Context } from 'koa'
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { UserHistory } from '../../entities'
import { NewUserHistory, UserHistoryPatch } from '../types'

const PaginatedUserHistoryResponse = PaginatedResponse(UserHistory)
type PaginatedUserHistoryResponse = InstanceType<typeof PaginatedUserHistoryResponse>

@Service()
@Resolver(of => UserHistory)
export class UserHistoryResolver {
  @Query(returns => UserHistory)
  async userHistory(@Arg('name') name: string, @Ctx() context: Context & Record<string, any>) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    return UserHistory.findOne({
      where: { domain: context.state.domainEntity, name },
      relations: ['userAccount']
    })
  }

  @Query(returns => PaginatedUserHistoryResponse)
  async userHistories(@Args() params: ListParam, @Ctx() context: Context & Record<string, any>) {
    const queryBuilder = UserHistory.createQueryBuilder()
    buildQuery(queryBuilder, params, context, false)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('UserHistory.userAccount', 'UserAccount')
      .getManyAndCount()
    return { items, total }
  }

  @Mutation(returns => UserHistory)
  async createUserHistory(
    @Arg('UserHistory') userHistory: NewUserHistory,
    @Ctx() context: Context & Record<string, any>
  ) {
    const newUserHistory = new UserHistory()
    Object.assign(newUserHistory, userHistory)

    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    newUserHistory.domain = context.state.domainEntity
    newUserHistory.creator = context.state.user
    newUserHistory.updater = context.state.user

    return newUserHistory.save()
  }
  @Mutation(returns => [UserHistory])
  async deleteUserHistory(@Arg('id') id: string, @Ctx() context: Context & Record<string, any>) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    const willDelete = await UserHistory.findOne(id)
    return await UserHistory.remove([willDelete])
  }
  @Mutation(returns => UserHistory)
  async updateUserHistory(
    @Arg('id') id: string,
    @Arg('patch') patch: UserHistoryPatch,
    @Ctx() context: Context & Record<string, any>
  ) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    const userHistory = await UserHistory.findOne({ id })
    Object.assign(userHistory, patch)
    userHistory.updater = context.state.user

    return userHistory.save()
  }
  // @Mutation(returns => UserHistory)
  // @Authorized()
  // addUserHistory(@Arg('newUserHistoryData') newUserHistoryData: NewUserHistoryInput, @Ctx('user') user: User): Promise<UserHistory> {
  //   return this.UserHistoryService.addNew({ data: newUserHistoryData, user })
  // }
  // @Mutation(returns => Boolean)
  // @Authorized(Roles.Admin)
  // async removeUserHistory(@Arg('id') id: string) {
  //   try {
  //     await this.UserHistoryService.removeById(id)
  //     return true
  //   } catch {
  //     return false
  //   }
  // }
}
