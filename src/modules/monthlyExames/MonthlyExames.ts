import { Service } from 'typedi'
import { ClientSession, ObjectID, ObjectId } from 'mongodb'
import * as R from 'ramda'
import { DBCollections, ResourcesSort } from '../../common/types'
import createBaseService from '../../common/factories/createBaseService'
import { db } from '../../db'
import { CustomError } from '../../errorHandlers/customError'
import { MonthlyExame, MonthlyExameAddInput, MonthlyExamesFilterInput, MonthlyExamesGetResponse, Question, keys } from './types'

@Service()
export class MonthlyExamesService extends createBaseService(DBCollections.MONTHLY_EXAMES)<MonthlyExame> {
  constructor(private readonly monthlyExameCollection = db.collection<MonthlyExame>(DBCollections.MONTHLY_EXAMES)) {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Unreachable code error
  async all(
    filter: MonthlyExamesFilterInput,
    sort: any = ResourcesSort.NEWEST,
    page = 1,
    perPage = 30,
    filterFields: (keyof Omit<MonthlyExame, 'isDeleted' | 'createdAt' | 'modifiedAt' | '_id'>)[],
  ): Promise<MonthlyExamesGetResponse> {
    return super.all(
      {
        ...R.omit(['stage', 'month'], filter),
        ...(filter.stage && { stage: { $in: filter.stage } }),
        ...(filter.month && { month: { $in: filter.month } }),
      },
      sort,
      page,
      perPage,
      filterFields,
    )
  }

  async add(record: MonthlyExameAddInput, session?: ClientSession): Promise<MonthlyExame> {
    return await super.add({
      ...record,
      questions: record.questions.map((question) => {
        return {
          ...question,
          _id: new ObjectId(),
          result: { value: this.resultCalculation(question, question.result.key) as string, key: question.result.key },
        }
      }),
    })
  }

  private resultCalculation = (question: Question, resultKey: keys) => {
    if (question.a.key === resultKey) return question.a.value
    if (question.b.key === resultKey) return question.b.value
    if (question.c.key === resultKey) return question.c.value
    if (question.d.key === resultKey) return question.d.value
  }

  async addCQuestionToMonthlyExame(monthlyExameId: ObjectID, question: Question, session?: ClientSession): Promise<number | undefined> {
    const monthlyExame = await super.one({ _id: monthlyExameId })
    if (!monthlyExame) throw new CustomError('Exame_NOT_FOUND')
    const questionPush = (
      await this.monthlyExameCollection.findOneAndUpdate(
        { _id: monthlyExameId },
        {
          $push: {
            questions: {
              ...question,
              _id: new ObjectId(),
              result: { value: this.resultCalculation(question, question.result.key) as string, key: question.result.key },
            },
          },
        },
        { session },
      )
    ).ok
    return questionPush
  }

  async removeCQuestionToMonthlyExame(monthlyExameId: ObjectID, questionId: ObjectID, session?: ClientSession): Promise<number | undefined> {
    const monthlyExame = await super.one({ _id: monthlyExameId })
    if (!monthlyExame) throw new CustomError('Exame_NOT_FOUND')
    const questionPush = (
      await this.monthlyExameCollection.findOneAndUpdate({ _id: monthlyExameId }, { $pull: { questions: { _id: questionId } } }, { session })
    ).ok
    return questionPush
  }

  async editCQuestionToMonthlyExame(monthlyExameId: ObjectID, questionId: ObjectID, question: Question, session?: ClientSession): Promise<number | undefined> {
    const monthlyExame = await super.one({ _id: monthlyExameId })
    if (!monthlyExame) throw new CustomError('Exame_NOT_FOUND')
    const questionPush = (
      await this.monthlyExameCollection.findOneAndUpdate(
        { _id: monthlyExameId },
        {
          $set: {
            'questions.$[element]': {
              ...question,
              _id: new ObjectId(),
              result: { value: this.resultCalculation(question, question.result.key) as string, key: question.result.key },
            },
          },
        },
        {
          arrayFilters: [{ 'element._id': questionId }],
          session,
        },
      )
    ).ok
    return questionPush
  }
}
