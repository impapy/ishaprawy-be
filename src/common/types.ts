import { InputType, ObjectType, Field, Float, Int } from 'type-graphql'
import { ValidateNested } from 'class-validator'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { TokenType, UserType } from '../modules/account/types'
// import { UserType, TokenType } from '../modules/account/types'

@InputType('TextLangObjectInput')
@ObjectType()
export class TextLangObject {
  @Field()
  en: string

  @Field()
  ar: string
}

@InputType('TextLangObjectRequiredInput')
@ObjectType()
export class TextLangObjectRequired {
  @Field({ nullable: false })
  en: string

  @Field({ nullable: false })
  ar: string
}

export class MongoLocation {
  type: 'Point'

  coordinates: [number, number]
}

@InputType('LocationInput')
@ObjectType()
export class Location {
  @Field(() => Float)
  lng: number

  @Field(() => Float)
  lat: number
}

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class LocationInfoBase {
  @Field()
  formatted_address: string

  @Field()
  name: string
}
@InputType()
export class LocationInfoInput extends LocationInfoBase {
  @Field(() => Location)
  @ValidateNested()
  location?: Location
}
@ObjectType()
export class LocationInfo extends LocationInfoBase {
  @Field(() => Location)
  @ValidateNested()
  location?: MongoLocation
}
export type Payload = { username: string; user: ObjectId; userType: UserType; isSuperAdmin: boolean; type: TokenType }
export type LangType = keyof TextLangObject

export class Context {
  req: Request

  token?: string

  payload?: Payload

  isAdmin: boolean

  isSuperAdmin: boolean

  //  TODO: handle other user types when they're added

  isStudent: boolean

  requestId: string

  lang: LangType
}

export enum DBCollections {
  STUDENT = 'student',
  ACCOUNTS = 'accounts',
  ADMINS = 'admins',
  MONTHLY_EXAMES = 'monthlyExames',
}

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  total: number

  @Field(() => Int)
  currentPage: number

  @Field(() => Int)
  perPage: number

  @Field()
  hasNextPage: boolean
}

export enum ResourcesSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

export interface ResourcesSortOptions {
  NEWEST: { createdAt: -1 }
  OLDEST: { createdAt: 1 }
}

@InputType()
export class ResourcesFilterInput {
  @Field({ nullable: true })
  searchTerm?: string
}

export class BaseDocument {
  _id: ObjectId

  createdAt: Date

  modifiedAt: Date

  isDeleted: boolean
}
