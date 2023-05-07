import { Field, registerEnumType, ArgsType, ObjectType, InputType, createUnionType } from 'type-graphql'
import { ObjectId } from 'mongodb'
import { IsNotEmpty } from 'class-validator'
import { Student } from '../student/types'
import { Admin } from '../admin/types'

export enum UserType {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
}

export enum Stage {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  ASSISTANT = 'ASSISTANT',
}

registerEnumType(UserType, { name: 'userType' })
registerEnumType(Stage, { name: 'Stage' })

export class Account {
  user: ObjectId

  username: string

  password?: string

  stage?: Stage

  userType: UserType

  userSigningKey: string

  createdAt: Date

  modifiedAt: Date

  isConfirmed: boolean

  isDeleted: boolean

  verificationCode?: string
}

@ArgsType()
export class SendResetPasswordCodeArgs {
  @Field({ nullable: false })
  @IsNotEmpty()
  username: string

  @Field(() => UserType)
  userType?: UserType
}

@ArgsType()
export class VerifyResetPasswordArgs extends SendResetPasswordCodeArgs {
  @Field({ nullable: false })
  verificationCode: string
}

@ArgsType()
export class ResetPasswordArgs {
  @Field({ nullable: false })
  token: string

  @Field({ nullable: false })
  password: string
}

export class AccountEditArgs {
  filterQuery: AccountEditFilterQuery

  updateQuery: AccountEditUpdateQuery
}

export class AccountEditFilterQuery {
  user?: ObjectId

  userType?: UserType

  stage?: Stage

  username?: string
}

export class AccountEditUpdateQuery {
  password?: string

  verificationCode?: string

  isSuspended?: boolean

  isConfirmed?: boolean

  userSigningKey?: string
}

@ArgsType()
export class UserIdAsInputType {
  @Field({ nullable: false })
  user: ObjectId
}

@ArgsType()
export class LoginArgs {
  @Field({ nullable: false })
  username: string

  @Field({ nullable: false })
  password: string
}

export enum TokenType {
  ACCESS = 'ACCESS',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

@ArgsType()
export class ChangePasswordArgs {
  @Field({ nullable: false })
  password: string

  @Field({ nullable: false })
  newPassword: string
}

@ArgsType()
export class AccountGetArgs {
  @Field()
  user?: ObjectId

  @Field()
  username?: string
}

export class AccountAddArgs {
  user: ObjectId

  username: string

  userType: UserType

  stage?: Stage

  password: string
}

const LoginResponseUserUnion = createUnionType({
  name: 'LoginResponseUser',
  types: () => [Admin, Student] as const,
  resolveType: (value) => {
    if ('phone' in value) {
      return Admin
    }
    return Student
  },
})

@ObjectType()
export class LoginResponse {
  @Field()
  token: string

  @Field(() => LoginResponseUserUnion)
  user: Admin | Student

  @Field(() => UserType)
  userType?: UserType
}

@InputType()
export class LoginInput {
  @Field()
  username: string

  @Field()
  password: string
}
