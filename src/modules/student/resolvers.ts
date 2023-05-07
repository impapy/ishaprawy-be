import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { ObjectId } from 'mongodb'
import { omit } from 'ramda'
import { Context } from '../../common/types'
import { CustomError } from '../../errorHandlers/customError'
import { transaction } from '../../common/transaction'
import { UserType } from '../account/types'
import { AccountService } from '../account/Account'
import { CheckIsAdmin } from '../../common/middleware/checkIsAdmin'
import { Authenticate } from '../../common/middleware/authenticate'
import { CheckItsOwnAccountOrAdmin } from '../../common/middleware/checkItsOwnAccountOrAdmin'
import { StudentService } from './Student'
import { Student, StudentAddInput, StudentEditInput, StudentsGetInput, StudentsGetResponse } from './types'

@Service()
@Resolver(() => Student)
export class StudentResolver {
  constructor(private readonly studentService: StudentService, private readonly accountService: AccountService) {}

  @Mutation(() => Student)
  async studentAdd(@Arg('input') input: StudentAddInput, @Ctx() ctx: Context): Promise<Student> {
    const [account, possibleStudent] = await Promise.all([this.accountService.one({ username: input.email }), this.studentService.one({ email: input.email })])

    if (account && !account.isConfirmed) throw new CustomError('ACCOUNT_NOT_CONFIRMED')
    if (possibleStudent) throw new CustomError('STUDENT_EXISTS')

    let student: Student | null = null
    await transaction(async (session) => {
      const studentArgs = omit(['username', 'password', 'phone'], input)
      student = await this.studentService.add({ ...studentArgs, userType: UserType.STUDENT, isActive: true }, session)

      await this.accountService.add(
        {
          user: student._id,
          username: input.email,
          password: input.password,
          userType: UserType.STUDENT,
          stage: input.stage,
        },
        session,
      )
    })

    if (!student) throw new CustomError('ERROR_WHILE_CREATING_STUDENT')
    return student
  }

  @UseMiddleware(Authenticate, CheckIsAdmin)
  @Mutation(() => ObjectId)
  async studentDelete(@Arg('studentId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await this.studentService.delete({ _id })
  }

  @UseMiddleware(Authenticate, CheckItsOwnAccountOrAdmin)
  @Mutation(() => Student)
  async studentEdit(@Arg('studentId') _id: ObjectId, @Arg('update') update: StudentEditInput): Promise<Student> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await this.studentService.edit({ _id }, { ...update })
  }

  @UseMiddleware(Authenticate, CheckIsAdmin)
  @Query(() => StudentsGetResponse)
  async students(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: StudentsGetInput, @Ctx() ctx: Context): Promise<StudentsGetResponse> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await this.studentService.all(filter, sort, page, perPage, ['name'])
  }

  @UseMiddleware(Authenticate, CheckIsAdmin)
  @Query(() => Student)
  async student(@Arg('sellerId') _id: ObjectId): Promise<Student | null> {
    return await this.studentService.one({ _id })
  }

  /**
   * Field Resolvers
   * */
}
