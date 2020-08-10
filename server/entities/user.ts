import { config } from '@things-factory/env'
import { Domain } from '@things-factory/shell'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { AuthError } from '../errors/auth-error'
import { DomainError } from '../errors/user-domain-not-match-error'
import { Role } from './role'

var SECRET = config.get('SECRET')
if (!SECRET) {
  if (process.env.NODE_ENV == 'production') {
    throw new TypeError('SECRET key not configured.')
  } else {
    SECRET = '0xD58F835B69D207A76CC5F84a70a1D0d4C79dAC95'
  }
}
const ORMCONFIG = config.get('ormconfig', {})
const DATABASE_TYPE = ORMCONFIG.type

export enum UserStatus {
  INACTIVE = 'inactive',
  ACTIVATED = 'activated',
  DELETED = 'deleted',
  LOCKED = 'locked',
  BANNED = 'banned'
}

@Entity('users')
@Index('ix_user_0', (user: User) => [user.email], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({
    nullable: true
  })
  description: string

  @ManyToOne(type => Domain, {
    nullable: true
  })
  domain: Promise<Domain>

  @ManyToMany(type => Domain)
  @JoinTable({ name: 'users_domains' })
  domains: Promise<Domain[]>

  @Column()
  email: string

  @Column({
    nullable: true
  })
  password: string

  @ManyToMany(type => Role, role => role.users)
  @JoinTable({ name: 'users_roles' })
  roles: Role[]

  @Column({
    nullable: true
  })
  userType: string // default: 'user, enum: 'user', 'admin'

  @Column({
    nullable: true
  })
  locale: string

  @Column({
    type: DATABASE_TYPE == 'postgres' || DATABASE_TYPE == 'mysql' || DATABASE_TYPE == 'mariadb' ? 'enum' : 'smallint',
    enum: UserStatus,
    default: UserStatus.INACTIVE
  })
  status: UserStatus

  @Column({
    type: 'smallint',
    default: 0
  })
  failCount: number

  @ManyToOne(type => User, {
    nullable: true
  })
  creator: User

  @ManyToOne(type => User, {
    nullable: true
  })
  updater: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  /* signing for jsonwebtoken */
  async sign() {
    var user = {
      id: this.id,
      userType: this.userType,
      status: this.status,
      domain: await this.domain
    }

    return await jwt.sign(user, SECRET, {
      expiresIn: '7d',
      issuer: 'hatiolab.com',
      subject: 'user'
    })
  }

  /* encode password */
  static encode(password: string) {
    return crypto.createHmac('sha1', SECRET).update(password).digest('base64')
  }

  /* verify password */
  verify(password: string) {
    const encrypted = crypto.createHmac('sha1', SECRET).update(password).digest('base64')

    return this.password === encrypted
  }

  async checkDomain(domainName) {
    if (!domainName) {
      const domain = await this.domain
      if (domain?.subdomain) {
        throw new DomainError({
          errorCode: DomainError.ERROR_CODES.REDIRECT_TO_DEFAULT_DOMAIN,
          domains: this.domains
        })
      } else {
        throw new DomainError({
          errorCode: DomainError.ERROR_CODES.NO_SELECTED_DOMAIN,
          domains: this.domains
        })
      }
    } else {
      const domains = await this.domains
      if (!domains.length)
        throw new DomainError({
          errorCode: DomainError.ERROR_CODES.NO_AVAILABLE_DOMAIN,
          domains: []
        })

      let foundDomain = domains.find(d => d.subdomain == domainName)
      if (!foundDomain)
        throw new DomainError({
          errorCode: DomainError.ERROR_CODES.UNAVAILABLE_DOMAIN,
          domains
        })

      const repository = getRepository(User)
      this.domain = Promise.resolve(foundDomain)
      await repository.save(this)
    }

    return {
      token: await this.sign(),
      domains: this.domains
    }
  }

  /* verify jsonwebtoken */
  static async check(token: string) {
    var decoded = await jwt.verify(token, SECRET)

    return decoded
  }

  static async checkAuth(decoded) {
    const repository = getRepository(User)
    var user = await repository.findOne(decoded.id, {
      cache: true
    })

    if (!user)
      throw new AuthError({
        errorCode: AuthError.ERROR_CODES.USER_NOT_FOUND
      })
    else {
      switch (user.status) {
        case UserStatus.INACTIVE:
          throw new AuthError({
            errorCode: AuthError.ERROR_CODES.USER_NOT_ACTIVATED
          })
        case UserStatus.LOCKED:
          throw new AuthError({
            errorCode: AuthError.ERROR_CODES.USER_LOCKED
          })
        case UserStatus.DELETED:
          throw new AuthError({
            errorCode: AuthError.ERROR_CODES.USER_DELETED
          })
      }

      return user
    }
  }
}
