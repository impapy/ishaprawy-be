import { Service } from 'typedi'
import { ObjectId, ClientSession } from 'mongodb'
import { sign, verify } from 'jsonwebtoken'
import { compare, genSalt, hash } from 'bcryptjs'
import { customAlphabet } from 'nanoid'
import sgMail from '@sendgrid/mail'
import { equals, isNil, pick, reject } from 'ramda'
import { db } from '../../db/index'
import { CustomError } from '../../errorHandlers/customError'
import { DBCollections, Payload } from '../../common/types'
import secrets from '../../secrets'
import messages from '../../errorHandlers/messages'
import { sanitizeUsername } from '../../common/helpers'
import { AdminService } from '../admin/Admin'
import { StudentService } from '../student/Student'
import { Student } from '../student/types'
import { Account, AccountAddArgs, AccountEditArgs, AccountGetArgs, LoginInput, LoginResponse, TokenType, UserType } from './types'

@Service()
export class AccountService {
  private readonly accounts = db.collection<Account>(DBCollections.ACCOUNTS)

  constructor(private readonly adminService: AdminService, private readonly studentService: StudentService) {}

  static async signToken(payload: Record<string, string>, userSigningKey: string): Promise<string> {
    const keysMix = `${secrets.JWT_SECRET}${userSigningKey}`
    const token = sign(payload, keysMix)
    return token
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await genSalt()
    const hashedPassword = await hash(password, salt)
    return hashedPassword
  }

  static async comparePasswords(password: string, passwordHash: string): Promise<boolean> {
    const passwordMatched = await compare(password, passwordHash)
    return passwordMatched
  }

  async one({ username, user }: AccountGetArgs): Promise<Account | null> {
    if (!user && !username) return null

    return await this.accounts.findOne({
      isDeleted: false,
      ...(username && { username: sanitizeUsername(username) }),
      ...(user && { user }),
    })
  }

  async add({ user, userType, username, password, stage }: AccountAddArgs, session?: ClientSession): Promise<Account> {
    const sanitizedUsername = sanitizeUsername(username)
    if (!sanitizedUsername) throw new CustomError('USERNAME_REQUIRED')

    const salt = await genSalt()

    const now = new Date()

    const insertedResult = await this.accounts.insertOne(
      {
        user,
        userType,
        ...(password && { password: await AccountService.hashPassword(password) }),
        stage,
        username: sanitizedUsername,
        userSigningKey: salt,
        createdAt: now,
        modifiedAt: now,
        isConfirmed: true,
        isDeleted: false,
      },
      { session },
    )
    return insertedResult.ops[0]
  }

  async edit(args: AccountEditArgs, session?: ClientSession): Promise<Account> {
    const modifiedAt = new Date()
    const { filterQuery, updateQuery } = args

    const result = await this.accounts.findOneAndUpdate(
      { ...pick(['user', 'userType'], filterQuery), ...(filterQuery.username && { username: sanitizeUsername(filterQuery.username) }) },
      { $set: { ...updateQuery, modifiedAt } },
      { ...(session && { session }) },
    )

    if (!result.value) throw new CustomError('ACCOUNT_NOT_FOUND')

    return result.value
  }

  async delete(user: ObjectId, session?: ClientSession): Promise<ObjectId> {
    const result = await this.accounts.findOneAndUpdate(
      { user, isDeleted: false },
      { $set: { modifiedAt: new Date(), isDeleted: true } },
      { ...(session && { session }) },
    )

    if (!result.value) {
      throw new CustomError('NOT_FOUND')
    }

    return result.value.user
  }

  async login(args: LoginInput, account: Account): Promise<LoginResponse> {
    const isMatches = await AccountService.comparePasswords(args.password, account.password as string)

    if (!isMatches) {
      throw new CustomError('INCORRECT_CREDENTIALS')
    }

    const token = await AccountService.signToken(
      {
        user: account.user.toString(),
        username: account.username,
        type: TokenType.ACCESS,
        userSigningKey: account.userSigningKey,
        userType: account.userType,
      },
      account.userSigningKey,
    )

    const admin = await this.adminService.one({ _id: account.user })
    let student: Student | null = null

    if (!admin) {
      student = (await this.studentService.one({ _id: account.user }))!
    }

    return {
      token,
      userType: account.userType,
      user: (admin || student)!,
    }
  }

  async checkUsernameExist(username?: string, _id?: ObjectId): Promise<boolean> {
    if (!username) return false

    return !!(await this.accounts.findOne({
      username: sanitizeUsername(username),
      ...(_id && { _id: { $ne: _id } }),
    }))
  }

  async sendEmail(code: string, email: string, subject: string, body: string): Promise<boolean> {
    const emailTemplate = `
        <strong>${subject}</strong>
        <p>
          ${code} ${body}
        </p>
      `
    try {
      sgMail.setApiKey(/*secrets.SENDGRID_API_KEY*/ 'for later')
      const msg = {
        to: email,
        from: /*secrets.EMAIL_SENDER*/ 'for later',
        subject,
        html: emailTemplate,
      }
      await sgMail.send(msg, false)
    } catch (error) {
      throw new CustomError('COULD_NOT_SEND_EMAIL')
    }

    return true
  }

  async passwordCodeSendReset(username: string, email: string, lang: 'en' | 'ar'): Promise<boolean> {
    const verificationCode = customAlphabet('0123456789', 4)()
    const emailSent = await this.sendEmail(verificationCode, email, messages?.RESET_PASSWORD_CODE?.[lang], messages?.RESET_PASSWORD_CODE?.[lang])
    await this.edit({
      filterQuery: { username },
      updateQuery: { verificationCode },
    })
    return emailSent
  }

  async passwordCodeVerifyReset(username: string, verificationCode: string): Promise<string> {
    const account = await this.one({ username })
    if (!account) {
      throw new CustomError('ACCOUNT_NOT_FOUND')
    }
    if (!equals(account?.verificationCode, verificationCode)) {
      throw new CustomError('INCORRECT_CODE')
    }

    return sign(
      { username: this.parseUsername(username), userType: account.userType, user: account?.user, type: TokenType.RESET_PASSWORD },
      secrets.JWT_SECRET,
      { expiresIn: 600 },
    )
  }

  parseUsername(username: string): string {
    return username.trim().toLowerCase()
  }

  async passwordReset(token: string, password: string): Promise<string> {
    try {
      const payload = verify(token, secrets.JWT_SECRET) as Payload
      if (payload.type !== TokenType.RESET_PASSWORD) throw new CustomError('UNAUTHORIZED')

      const { username, user, userType, userSigningKey } = await this.edit({
        filterQuery: { user: new ObjectId(payload.user) },
        updateQuery: { password: await AccountService.hashPassword(password), isConfirmed: true },
      })
      return await AccountService.signToken({ username, user: user.toHexString(), userType, type: TokenType.ACCESS }, userSigningKey)
    } catch (error) {
      throw new CustomError('CODE_EXPIRED')
    }
  }

  async getEmail({ username, userId, userType }: { username?: string; userId?: ObjectId; userType?: UserType }): Promise<string | undefined> {
    const userFromDb = (await this.one(reject(isNil, { username, userType, user: userId }))) as Account
    if (!userFromDb) throw new CustomError('ACCOUNT_NOT_FOUND')
    let email
    switch (userFromDb?.userType) {
      case UserType.ADMIN:
        email = (await this.adminService.one(userFromDb.user))?.email
        break
      case UserType.STUDENT:
        email = (await this.studentService.one(userFromDb.user))?.email
        break
    }
    return email
  }
}
