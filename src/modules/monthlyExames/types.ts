import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { ObjectId } from 'mongodb'
import { Type } from 'class-transformer'
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { Stage } from '../account/types'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import { ResourcesFilterInput } from '../../common/types'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'

export enum MonthlyExamesSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

export enum Month {
  JANUARY = 'يناير',
  FEBRUARY = 'فبراير',
  MARCH = 'مارس',
  APRIL = 'ابريل',
  MAY = 'مايو',
  JUNE = 'يونيو',
  JULY = 'يوليو',
  AUGUST = 'اغسطس',
  SEPTEMBER = 'سبتمبر',
  OCTOBER = 'اكتوبر',
  NOVEMVER = 'نوفمبر',
  DECEMBER = 'ديسمبر',
}

export enum keys {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

registerEnumType(MonthlyExamesSort, { name: 'MonthlyExamesSort' })
registerEnumType(Month, { name: 'Month' })
registerEnumType(keys, { name: 'keys' })

@ObjectType()
@InputType('ChoiceInput')
class Choice {
  @Field(() => keys, { defaultValue: keys.A })
  key: keys

  @Field()
  value: string
}

@ObjectType()
@InputType('ChoiceAInput')
class ChoiceA {
  @Field(() => keys, { defaultValue: keys.A })
  key: keys

  @Field()
  value: string
}
@ObjectType()
@InputType('ChoiceBInput')
class ChoiceB {
  @Field(() => keys, { defaultValue: keys.B })
  key: keys

  @Field()
  value: string
}
@ObjectType()
@InputType('ChoiceCInput')
class ChoiceC {
  @Field(() => keys, { defaultValue: keys.C })
  key: keys

  @Field()
  value: string
}
@ObjectType()
@InputType('ChoiceDInput')
class ChoiceD {
  @Field(() => keys, { defaultValue: keys.D })
  key: keys

  @Field()
  value: string
}

@ObjectType()
@InputType('ResultInput')
class Result {
  @Field(() => keys)
  key: keys

  @Field({ nullable: true })
  value: string
}

@ObjectType()
@InputType('QuestionInput')
export class Question {
  @Field(() => ObjectId, { nullable: true })
  _id: ObjectId

  @Field()
  label: string

  @Field(() => ChoiceA)
  a: ChoiceA

  @Field(() => ChoiceB)
  b: ChoiceB

  @Field(() => ChoiceC)
  c: ChoiceC

  @Field(() => ChoiceD)
  d: ChoiceD

  @Field(() => Result)
  result: Result

  @Field()
  marke: number
}

@InputType()
@ObjectType('BaseMonthlyExame', { isAbstract: true })
export class MonthlyExameAddInput {
  @Field(() => Stage)
  stage: Stage

  @Field(() => Month)
  month: Month

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'AT_LEAST_ONE_ITEM' })
  @Type(() => Question)
  @Field(() => [Question])
  questions: Question[]

  @Field({ nullable: true })
  solutionExam?: string
}

@ObjectType()
export class MonthlyExame extends MonthlyExameAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@InputType()
export class MonthlyExameEditInput {
  @Field(() => Stage, { nullable: true })
  stage?: Stage

  @Field(() => Month, { nullable: true })
  month?: Month

  @Field({ nullable: true })
  solutionExam?: string
}

@ObjectType()
export class MonthlyExamesGetResponse extends ResourcesGetResponse(MonthlyExame) {}

@InputType()
export class MonthlyExamesFilterInput extends ResourcesFilterInput {
  @Field(() => [Stage], { nullable: 'itemsAndList' })
  stage?: Stage[]

  @Field(() => [Month], { nullable: 'itemsAndList' })
  month?: Month[]
}

@InputType()
export class MonthlyExamesGetInput extends ResourcesGetInput(MonthlyExamesFilterInput) {
  @Field(() => MonthlyExamesSort, { defaultValue: MonthlyExamesSort.NEWEST })
  sort: MonthlyExamesSort = MonthlyExamesSort.NEWEST
}
