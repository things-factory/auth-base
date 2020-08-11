import { Domain } from '@things-factory/domain-base'
import { buildQuery, ListParam, PaginatedResponse } from '@things-factory/graphql-utils'
import { Context } from 'koa'
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { PermitUrl } from '../../entities'
import { NewPermitUrl, PermitUrlPatch } from '../types'

const PaginatedPermitUrlResponse = PaginatedResponse(PermitUrl)
type PaginatedPermitUrlResponse = InstanceType<typeof PaginatedPermitUrlResponse>

@Service()
@Resolver(of => PermitUrl)
export class PermitUrlResolver {
  constructor(@InjectRepository(PermitUrl) private readonly permitUrlRepository: Repository<PermitUrl>) {}
  @Query(returns => PermitUrl)
  async permitUrl(@Arg('name') name: string, @Ctx() context: Context & Record<string, any>) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    return PermitUrl.findOne({
      where: { domain: context.state.domainEntity, name }
    })
  }

  @Query(returns => PaginatedPermitUrlResponse)
  async permitUrls(@Args() params: ListParam, @Ctx() context: Context & Record<string, any>) {
    const queryBuilder = PermitUrl.createQueryBuilder()
    buildQuery(queryBuilder, params, context, false)
    const [items, total] = await queryBuilder.getManyAndCount()
    return { items, total }
  }

  @Mutation(returns => PermitUrl)
  async createPermitUrl(@Arg('permitUrl') permitUrl: NewPermitUrl) {
    const createPermitUrl = new PermitUrl()
    Object.assign(createPermitUrl, permitUrl)
    return createPermitUrl.save()
  }

  @Mutation(returns => [PermitUrl])
  async deletePermitUrl(@Arg('name') name: string) {
    const willDelete = await PermitUrl.find({ name })
    const deleted = await PermitUrl.delete({ name })
    return willDelete
  }

  @Mutation(returns => PermitUrl)
  async updatePermitUrl(@Arg('name') name: string, @Arg('patch') patch: PermitUrlPatch) {
    const permitUrl = await PermitUrl.findOne({ name })
    Object.assign(permitUrl, patch)

    return await permitUrl.save()
  }
  // @Mutation(returns => PermitUrl)
  // @Authorized()
  // addPermitUrl(@Arg('newPermitUrlData') newPermitUrlData: NewPermitUrlInput, @Ctx('user') user: User): Promise<PermitUrl> {
  //   return this.PermitUrlService.addNew({ data: newPermitUrlData, user })
  // }
  // @Mutation(returns => Boolean)
  // @Authorized(Roles.Admin)
  // async removePermitUrl(@Arg('id') id: string) {
  //   try {
  //     await this.PermitUrlService.removeById(id)
  //     return true
  //   } catch {
  //     return false
  //   }
  // }
}
