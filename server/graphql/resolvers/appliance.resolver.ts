import { Domain } from '@things-factory/domain-base'
import { buildQuery, ListParam, PaginatedResponse } from '@things-factory/graphql-utils'
import { Context } from 'koa'
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Appliance, User } from '../../entities'
import { ApplianceInput } from '../types'

const PaginatedApplianceResponse = PaginatedResponse(Appliance)
type PaginatedApplianceResponse = InstanceType<typeof PaginatedApplianceResponse>

@Service()
@Resolver(of => Appliance)
export class ApplianceResolver {
  constructor(@InjectRepository(Appliance) private readonly applianceRepository: Repository<Appliance>) {}
  @Query(returns => Appliance)
  async appliance(@Arg('name') name: string, @Ctx() context: Context & Record<string, any>) {
    return this.applianceRepository.findOne({
      where: { appliance: context.state.appliance, name },
      relations: ['creator', 'updater']
    })
  }
  @Query(returns => PaginatedApplianceResponse)
  async appliances(@Args() params: ListParam, @Ctx() context: Context & Record<string, any>) {
    const queryBuilder = this.applianceRepository.createQueryBuilder()
    buildQuery(queryBuilder, params, context, false)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Appliance.creator', 'Creator')
      .leftJoinAndSelect('Appliance.updater', 'Updater')
      .getManyAndCount()
    return { items, total }
  }
  @Mutation(returns => Appliance)
  async createAppliance(@Arg('appliance') appliance: ApplianceInput, @Ctx() context: Context & Record<string, any>) {
    const stateDomain = context?.state?.domain as Domain
    const stateUser = context?.state?.user as User

    const applianceEntity = this.applianceRepository.create(appliance)
    applianceEntity.domain = stateDomain
    applianceEntity.updater = stateUser
    applianceEntity.creator = stateUser

    return this.applianceRepository.save(applianceEntity)
  }
  @Mutation(returns => [Appliance])
  async deleteAppliance(@Arg('name') name: string, @Ctx() context: Context & Record<string, any>) {
    const stateDomain = context?.state?.domain as Domain

    const findOption = { domain: stateDomain, name }
    const willDelete = await this.applianceRepository.find(findOption)
    await this.applianceRepository.delete(findOption)
    return willDelete
  }
  @Mutation(returns => Appliance)
  async updateAppliance(
    @Arg('name') name: String,
    @Arg('patch') patch: ApplianceInput,
    @Ctx() context: Context & Record<string, any>
  ) {
    const repository = this.applianceRepository
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    const appliance = await repository.findOne({ where: { domain: context.state.domainEntity, name } })
    return await repository.save({
      ...appliance,
      ...patch,
      updater: context.state.user
    })
  }

  @FieldResolver()
  async creator(@Root() appliance: Appliance) {
    const userId = appliance?.creatorId
    return await this.findUserById(userId)
  }

  @FieldResolver()
  async updater(@Root() appliance: Appliance) {
    const userId = appliance?.updaterId
    await this.findUserById(userId)
  }

  async findUserById(id) {
    return User.findByIdsBatch(id)
  }
  // @Mutation(returns => Appliance)
  // @Authorized()
  // addappliance(@Arg('newapplianceData') newapplianceData: NewapplianceInput, @Ctx('user') user: User): Promise<appliance> {
  //   return this.applianceService.addNew({ data: newapplianceData, user })
  // }
  // @Mutation(returns => Boolean)
  // @Authorized(Roles.Admin)
  // async removeappliance(@Arg('id') id: string) {
  //   try {
  //     await this.applianceService.removeById(id)
  //     return true
  //   } catch {
  //     return false
  //   }
  // }
}
