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
  constructor(@InjectRepository(PermitUrl) private readonly PermitUrlRepository: Repository<PermitUrl>) {}
  @Query(returns => PermitUrl)
  async PermitUrl(@Arg('name') name: string, @Ctx() context: Context & Record<string, any>) {
    return this.PermitUrlRepository.findOne({
      where: { PermitUrl: context.state.PermitUrl, name }
    })
  }
  @Query(returns => PaginatedPermitUrlResponse)
  async PermitUrls(@Args() params: ListParam, @Ctx() context: Context & Record<string, any>) {
    const queryBuilder = this.PermitUrlRepository.createQueryBuilder()
    buildQuery(queryBuilder, params, context, false)
    const [items, total] = await queryBuilder.getManyAndCount()
    return { items, total }
  }
  @Mutation(returns => PermitUrl)
  async createPermitUrl(@Arg('permitUrl') PermitUrl: NewPermitUrl) {
    return this.PermitUrlRepository.save(PermitUrl)
  }
  @Mutation(returns => [PermitUrl])
  async deletePermitUrl(@Arg('name') name: string) {
    const willDelete = this.PermitUrlRepository.find({ name })
    await this.PermitUrlRepository.delete({ name })
    return willDelete
  }
  @Mutation(returns => PermitUrl)
  async updatePermitUrl(@Arg('name') name: string, @Arg('patch') patch: PermitUrlPatch) {
    const repository = this.PermitUrlRepository
    const PermitUrl = await repository.findOne({ name })
    return await repository.save({
      ...PermitUrl,
      ...patch
    })
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
