import { Arg, Mutation, Query, Resolver, UseMiddleware, Root, FieldResolver } from 'type-graphql'
import { Service } from 'typedi'
import { ObjectId } from 'mongodb'
import { sum } from 'ramda'
import { Authenticate } from '../../common/middleware/authenticate'
import { MonthlyExamesService } from './MonthlyExames'
import { MonthlyExame, MonthlyExameAddInput, MonthlyExameEditInput, MonthlyExamesGetInput, MonthlyExamesGetResponse, Question } from './types'

@Service()
@Resolver(() => MonthlyExame)
class MonthlyExamesResolver {
  constructor(private readonly monthlyExamesService: MonthlyExamesService) {}

  @UseMiddleware(Authenticate)
  @Mutation(() => MonthlyExame)
  async monthlyExameAdd(@Arg('input') input: MonthlyExameAddInput): Promise<MonthlyExame> {
    return await this.monthlyExamesService.add(input)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => ObjectId)
  async monthlyExameDelete(@Arg('monthlyExameId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await this.monthlyExamesService.delete({ _id })
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => MonthlyExame)
  async monthlyExameEdit(@Arg('monthlyExameId') _id: ObjectId, @Arg('update', { defaultValue: {} }) update: MonthlyExameEditInput): Promise<MonthlyExame> {
    return await this.monthlyExamesService.edit({ _id }, update)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Number)
  async questionAdd(@Arg('monthlyExameId') _id: ObjectId, @Arg('question') question: Question): Promise<number | undefined> {
    return await this.monthlyExamesService.addCQuestionToMonthlyExame(_id, question)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Number)
  async questionRemove(@Arg('monthlyExameId') _id: ObjectId, @Arg('questionId') questionId: ObjectId): Promise<number | undefined> {
    return await this.monthlyExamesService.removeCQuestionToMonthlyExame(_id, questionId)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Number)
  async questionEdit(
    @Arg('monthlyExameId') _id: ObjectId,
    @Arg('questionId') questionId: ObjectId,
    @Arg('question') question: Question,
  ): Promise<number | undefined> {
    return await this.monthlyExamesService.editCQuestionToMonthlyExame(_id, questionId, question)
  }

  @Query(() => MonthlyExamesGetResponse)
  async monthlyExames(@Arg('input', { defaultValue: {} }) { filter = {}, sort, page, perPage }: MonthlyExamesGetInput): Promise<MonthlyExamesGetResponse> {
    return await this.monthlyExamesService.all(filter, sort, page, perPage, [])
  }

  @Query(() => MonthlyExame, { nullable: true })
  async monthlyExame(@Arg('monthlyExameId') _id: ObjectId): Promise<MonthlyExame | null> {
    return await this.monthlyExamesService.one(_id)
  }

  @FieldResolver(() => Number)
  async examMarke(@Root() monthlyExame: MonthlyExame): Promise<number> {
    const allMarkes = monthlyExame.questions.map((question) => question.marke)
    return sum(allMarkes)
  }
}

export default MonthlyExamesResolver
