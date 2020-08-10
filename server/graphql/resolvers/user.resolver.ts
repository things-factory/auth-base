import { Domain } from '@things-factory/domain-base'
import { buildQuery, ListParam, PaginatedResponse } from '@things-factory/graphql-utils'
import { Context } from 'koa'
import { Arg, Args, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'
import { Connection } from 'typeorm'
import { InjectConnection } from 'typeorm-typedi-extensions'
import { deleteAccount, deleteAccounts } from '../../controllers/delete-account'
import { Role, User } from '../../entities'
import { NewUser, UserPatch } from '../types'
import { PrivilegeOption } from '../auth-checker'

const PaginatedUserResponse = PaginatedResponse(User)
type PaginatedUserResponse = InstanceType<typeof PaginatedUserResponse>

@Service()
@Resolver(of => User)
export class UserResolver {
  constructor(@InjectConnection() private connection: Connection) {}

  @Authorized<PrivilegeOption>({ category: 'user', privilege: 'query' })
  @Query(returns => User)
  async user(@Arg('email') email: string) {
    return User.findOne({ email })
  }

  @Authorized<PrivilegeOption>({ category: 'user', privilege: 'query' })
  @Query(returns => PaginatedUserResponse)
  async users(@Args() params: ListParam, @Ctx() context: Context & Record<string, any>) {
    const queryBuilder = User.createQueryBuilder()
    buildQuery(queryBuilder, params, context)

    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }

  @Authorized<PrivilegeOption>({ category: 'user', privilege: 'mutation' })
  @Mutation(returns => User)
  async createUser(@Arg('user') user: NewUser, @Ctx() context: Context & Record<string, any>) {
    if (user.roles && user.roles.length) {
      user.roles = await Role.findByIds(user.roles.map(role => role.id))
    }

    user.domain = await Domain.findOne(user.domain.id)

    const newUser = new User()
    newUser.creator = context.state.user
    newUser.updater = context.state.user
    Object.assign(newUser, user)
    newUser.password = user.password ? User.encode(user.password) : null

    return newUser.save()
  }

  @Authorized<PrivilegeOption>({ category: 'user', privilege: 'mutation' })
  @Mutation(returns => Boolean)
  async deleteUser(@Arg('email') email: string) {
    await deleteAccount({ email })

    return true
  }

  @Authorized<PrivilegeOption>({ category: 'user', privilege: 'mutation' })
  @Mutation(returns => Boolean)
  async deleteUsers(@Arg('emails', type => [String]) emails: string[]) {
    await deleteAccounts({ emails })

    return true
  }

  @Authorized<PrivilegeOption>({ category: 'user', privilege: 'mutation' })
  @Mutation(returns => User)
  async updateUser(
    @Arg('email') email: string,
    @Arg('patch') patch: UserPatch,
    @Ctx() context: Context & Record<string, any>
  ) {
    const user = await User.findOne({
      email
    })

    Object.assign(user, patch)
    user.roles = await Role.findByIds(patch.roles.map((role: Role) => role.id))
    user.updater = context.state.user
  }

  @Authorized<PrivilegeOption>({ category: 'user', privilege: 'mutation' })
  @Mutation(returns => [User])
  async updateMultipleUser(
    @Arg('patches', type => [UserPatch]) patches: UserPatch[],
    @Ctx() context: Context & Record<string, any>
  ) {
    const results = []
    const _createRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === '+')
    const _updateRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === 'M')
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    await this.connection.transaction(async txManager => {
      const userRepo = txManager.getRepository(User)
      if (_createRecords.length > 0) {
        for (let i = 0; i < _createRecords.length; i++) {
          const newRecord = _createRecords[i]

          const result = await userRepo.save({
            ...newRecord,
            password: User.encode(newRecord.password),
            domain: newRecord.domain || context.state.domainEntity,
            creator: context.state.user,
            updater: context.state.user
          })

          // TODO: repository.save에서 domain ID가 같이 저장되게 바꾸어야 함.
          await txManager
            .createQueryBuilder()
            .update('users')
            .set({
              domain: (newRecord?.domain || context?.state?.domain)?.id
            })
            .where({
              id: result?.id
            })
            .execute()

          // repository api는 작동하지 않음.
          await txManager
            .createQueryBuilder()
            .insert()
            .into('users_domains')
            .values({
              usersId: result.id,
              domainsId: newRecord.domain.id
            })
            .execute()

          results.push({ ...result, cuFlag: '+' })
        }
      }

      if (_updateRecords.length > 0) {
        for (let i = 0; i < _updateRecords.length; i++) {
          const newRecord = _updateRecords[i]
          const user = await userRepo.findOne(newRecord.id)

          const result = await userRepo.save({
            ...user,
            ...newRecord,
            password: newRecord.password ? User.encode(newRecord.password) : user.password,
            updater: context.state.user
          })

          if (newRecord.status) {
            try {
              await txManager
                .createQueryBuilder()
                .insert()
                .into('users_domains')
                .values({
                  usersId: user.id,
                  domainsId: (await user.domain).id
                })
                .execute()
            } catch (e) {
              // repository api는 작동하지 않음.
              await txManager
                .createQueryBuilder()
                .update('users_domains')
                .set({
                  domainsId: newRecord.domain.id
                })
                .where({
                  usersId: user.id
                })
                .execute()
            }
          }

          results.push({ ...result, cuFlag: 'M' })
        }
      }
    })

    return results
  }

  @Authorized<PrivilegeOption>()
  @FieldResolver()
  async domain(@Root() user: User) {
    const domainId = user?.domainId
    return Domain.findByIdsBatch(domainId)
  }
  // @Mutation(returns => User)
  // @Authorized[(])
  // addUser(@Arg('newUserData') newUserData: NewUserInput, @Ctx('user') user: User): Promise<User> {
  //   return this.UserService.addNew({ data: newUserData, user })
  // }
  // @Mutation(returns => Boolean)
  // @Authorized<PrivilegeOption>([Roles.Admin])
  // async removeUser(@Arg('id') id: string) {
  //   try {
  //     await this.UserService.removeById(id)
  //     return true
  //   } catch {
  //     return false
  //   }
  // }
}
