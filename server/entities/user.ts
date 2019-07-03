import { BaseEntity } from '@things-factory/shell'
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
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Role } from './role'

/* TODO SECRET KEY를 변경할 수 있는 방법을 제시해야 한다. */
const SECRET = '0xD58F835B69D207A76CC5F84a70a1D0d4C79dAC95'

@Entity('users')
@Index('ix_user_0', (user: User) => [user.email], { unique: true })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  email: string

  @Column('text', {
    nullable: true
  })
  password: string

  @ManyToMany(type => Role, role => role.users)
  @JoinTable({ name: 'users-roles' })
  roles: Role[]

  @Column('text', {
    nullable: true
  })
  userType: string // default: 'user, enum: 'user', 'admin'

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  /* signing for jsonwebtoken */
  async sign() {
    var user = {
      id: this.id,
      email: this.email,
      userType: this.userType
    }

    return await jwt.sign(user, SECRET, {
      expiresIn: '7d',
      issuer: 'hatiolab.com',
      subject: 'user'
    })
  }

  /* encode password */
  static encode(password: string) {
    return crypto
      .createHmac('sha1', SECRET)
      .update(password)
      .digest('base64')
  }

  /* verify password */
  verify(password: string) {
    const encrypted = crypto
      .createHmac('sha1', SECRET)
      .update(password)
      .digest('base64')

    return this.password === encrypted
  }

  /* verify jsonwebtoken */
  static async check(token: string) {
    var decoded = await jwt.verify(token, SECRET)

    const repository = getRepository(User)
    var user = await repository.findOne({
      email: decoded.email
    })

    if (!user) {
      throw new Error('user notfound.')
    }

    return decoded
  }
}
