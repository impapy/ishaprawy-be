import { IsEmail, IsPhoneNumber, IsUrl, MaxLength, MinLength, ValidateNested, max, min } from 'class-validator'
import { ObjectId } from 'mongodb'
import { Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'

import { PageInfo, ResourcesFilterInput } from '../../common/types'
import { PASSWORD_MIN_LENGTH, PER_PAGE } from '../../constants'
import { Stage, UserType } from '../account/types'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'

export interface StudentsSortOptions {
  NEWEST: { createdAt: -1 }
  OLDEST: { createdAt: 1 }
}

export enum StudentsSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}
registerEnumType(StudentStatus, { name: 'StudentStatus' })
registerEnumType(StudentsSort, { name: 'StudentsSort' })

@ObjectType()
@InputType('ReportTestInput')
export class ReportTest {
  @Field(() => ObjectId)
  testId: ObjectId

  @Field(() => Int)
  degre: number

  @Field(() => Boolean, { nullable: true })
  issuccessfull?: boolean
}

@ObjectType()
export class Student {
  @Field()
  _id: ObjectId

  @Field()
  name: string

  @Field()
  email: string

  @Field(() => [ReportTest], { nullable: true })
  reportsTest?: ReportTest[]

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean

  isDeleted: boolean

  @Field(() => UserType)
  userType: UserType

  @Field(() => Stage)
  stage: Stage
}

@InputType()
export class StudentAddInput {
  @Field()
  name: string

  @IsEmail({}, { message: 'INVALID_EMAIL' })
  @Field()
  email: string

  @MinLength(PASSWORD_MIN_LENGTH, { message: 'PASSWORD_TOO_SHORT' })
  @Field()
  password: string

  @Field(() => [ReportTest], { nullable: true })
  @ValidateNested()
  reportsTest?: ReportTest[]

  userType: UserType

  @Field(() => Stage)
  stage: Stage

  isActive: true
}

@ObjectType()
export class StudentAddResponse {
  @Field()
  token: string

  @Field(() => Student)
  student: Student
}

@InputType()
export class StudentEditInput {
  @Field({ nullable: true })
  name?: string

  @Field(() => [ReportTest], { nullable: true })
  reportsTest: ReportTest[]

  @Field({ nullable: true })
  isActive?: boolean
}

@ObjectType()
export class StudentsGetResponse extends ResourcesGetResponse(Student) {}

@InputType()
export class StudentsFilterInput extends ResourcesFilterInput {
  @Field(() => [Stage], { nullable: 'itemsAndList' })
  stage?: Stage[]
}

@InputType()
export class StudentsGetInput extends ResourcesGetInput(StudentsFilterInput) {
  @Field(() => StudentsSort, { defaultValue: StudentsSort.NEWEST })
  sort: StudentsSort = StudentsSort.NEWEST
}

@InputType()
export class StudentsEditStatusInput {
  @Field()
  StudentId: ObjectId

  @Field(() => StudentStatus)
  status: StudentStatus
}
