import { Context } from 'koa'
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Domain } from '@things-factory/domain-base'
import { buildQuery, ListParam, PaginatedResponse } from '@things-factory/graphql-utils'
import { CreateapplianceInput } from '../types/appliance/create-appliance-input'
import { UpdateapplianceInput } from '../types/appliance/appliance-input'
import { Appliance } from '../../entities'

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
      relations: ['domain', 'creator', 'updater']
    })
  }
  @Query(returns => PaginatedApplianceResponse)
  async appliances(@Args() params: ListParam, @Ctx() context: Context & Record<string, any>) {
    const queryBuilder = this.applianceRepository.createQueryBuilder()
    buildQuery(queryBuilder, params, context, false)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Appliance.domain', 'Domain')
      .leftJoinAndSelect('Appliance.creator', 'Creator')
      .leftJoinAndSelect('Appliance.updater', 'Updater')
      .getManyAndCount()
    return { items, total }
  }
  @Mutation(returns => Appliance)
  async createAppliance(@Arg('appliance') appliance: ApplianceInput) {
    return this.applianceRepository.save({
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...appliance
    })
  }
  @Mutation(returns => [Appliance])
  async deleteAppliance(@Arg('name') name: string) {
    const findOption = { domain: context.state.domain, name }
    const willDelete = this.applianceRepository.find(findOption)
    await this.applianceRepository.delete(findOption)
    return willDelete
  }
  @Mutation(returns => Appliance)
  async updateAppliance(@Arg('name') name: String, @Arg('patch') patch: ApplianceInput) {
    const repository = this.applianceRepository
    const appliance = await repository.findOne({ where: { domain: context.state.domain, name } })
    return await repository.save({
      ...appliance,
      ...patch,
      updater: context.state.user
    })
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
