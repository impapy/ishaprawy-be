import { ObjectType, Field, registerEnumType, InputType } from 'type-graphql'
import { ObjectId } from 'mongodb'
import { IsEmail, IsPhoneNumber } from 'class-validator'
import { ResourcesFilterInput } from '../../common/types'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import { IsUnique } from '../../common/custom-validators/isUnique'
import { UserType } from '../account/types'

@ObjectType()
export class Admin {
  @Field()
  _id: ObjectId

  @Field()
  name: string

  @Field()
  email: string

  @Field()
  phone: string

  isSuperAdmin: boolean

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean

  isSuspended: boolean

  userType: UserType
}

@InputType()
export class AdminAddInput {
  @Field()
  username: string

  @Field()
  password: string

  @Field()
  name: string

  @IsUnique({ message: 'PHONE_EXIST' })
  @IsPhoneNumber('EG')
  @Field()
  phone: string

  @Field()
  @IsUnique({ message: 'EMAIL_EXIST' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
  email: string

  isSuperAdmin: boolean

  userType: UserType
}

@InputType()
export class AdminEditInput {
  @Field()
  _id: ObjectId

  @Field()
  name?: string

  @Field()
  @IsUnique({ message: 'EMAIL_EXIST' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
  email?: string

  @IsUnique({ message: 'PHONE_EXIST' })
  @IsPhoneNumber('EG')
  @Field()
  phone?: string

  isSuspended?: boolean
}

export enum AdminSortOptions {
  Newest = 'Newest',
  Oldest = 'Oldest',
}

@ObjectType()
export class AdminAddResponse {
  @Field(() => Admin)
  admin: Admin

  @Field()
  token: string
}

registerEnumType(AdminSortOptions, { name: 'AdminSort' })

@InputType()
export class AdminsFilterInput extends ResourcesFilterInput {}

@ObjectType()
export class AdminsGetResponse extends ResourcesGetResponse(Admin) {}

@InputType()
export class AdminsGetInput extends ResourcesGetInput(AdminsFilterInput) {
  @Field(() => AdminSortOptions, { defaultValue: AdminSortOptions.Newest })
  sort: AdminSortOptions
}
