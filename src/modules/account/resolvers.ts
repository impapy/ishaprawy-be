import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { ObjectId } from 'mongodb'
import { AdminService } from '../admin/Admin'
import { Context, DBCollections } from '../../common/types'
import { Authenticate } from '../../common/middleware/authenticate'
import { CustomError } from '../../errorHandlers/customError'
import { StudentService } from '../student/Student'
import { Student } from '../student/types'
import { db } from '../../db'
import { CheckIsAdmin } from '../../common/middleware/checkIsAdmin'
import { transaction } from '../../common/transaction'
import { Account, LoginInput, LoginResponse, ResetPasswordArgs, SendResetPasswordCodeArgs, VerifyResetPasswordArgs } from './types'
import { AccountService } from './Account'

@Service()
@Resolver()
class AccountResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly adminService: AdminService,
    private readonly studentService: StudentService,
    private readonly accountCollection = db.collection<Account>(DBCollections.ACCOUNTS),
  ) {}

  @UseMiddleware(Authenticate, CheckIsAdmin)
  @Mutation(() => ObjectId)
  async studentConfirmed(@Arg('studentId') _id: ObjectId): Promise<ObjectId> {
    return transaction(async (session) => {
      const account = await this.accountCollection.findOne({ user: _id })

      if (!account) {
        throw new CustomError('ACCOUNT_NOT_FOUND')
      }

      await this.studentService.edit({ _id }, { isActive: !account.isConfirmed })

      return await (
        await this.accountService.edit({
          filterQuery: { user: _id },
          updateQuery: { isConfirmed: !account.isConfirmed },
        })
      ).user
    })
  }

  @Mutation(() => LoginResponse)
  async login(@Arg('input') input: LoginInput): Promise<LoginResponse> {
    const account = await this.accountService.one({ username: input.username })

    if (!account) {
      throw new CustomError('INCORRECT_CREDENTIALS')
    }

    if (!account.isConfirmed) {
      throw new CustomError('ACCOUNT_NOT_CONFIRMED')
    }

    return await this.accountService.login(input, account)
  }

  @Query(() => Student)
  @UseMiddleware(Authenticate)
  async me(@Ctx() ctx: Context): Promise<Student> {
    const student = await this.studentService.one({ _id: ctx.payload!.user })

    if (!student) {
      throw new CustomError('UNAUTHORIZED')
    }

    return student
  }

  @Mutation(() => Boolean)
  async passwordCodeSendReset(@Args() { username, userType }: SendResetPasswordCodeArgs, @Ctx() ctx: Context): Promise<boolean> {
    const email = (await this.accountService.getEmail({ username, userType })) as string
    return await this.accountService.passwordCodeSendReset(username, email, ctx.lang)
  }

  @Mutation(() => String)
  async passwordCodeVerifyReset(@Args() { username, verificationCode }: VerifyResetPasswordArgs): Promise<string> {
    return await this.accountService.passwordCodeVerifyReset(username, verificationCode)
  }

  @Mutation(() => String)
  async passwordReset(@Args() { token, password }: ResetPasswordArgs): Promise<string> {
    return await this.accountService.passwordReset(token, password)
  }
}

export default AccountResolver
