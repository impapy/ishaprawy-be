import type { Request } from 'express'
import { verify, decode } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { nanoid } from 'nanoid'
import languageParser from 'accept-language-parser'
import { Context, LangType, Payload } from './common/types'
import { db } from './db/index'
import { UserType, Account, TokenType } from './modules/account/types'
import secrets from './secrets'

export default async ({ req }: { req: Request }): Promise<Context> => {
  const context: Context = {
    lang: (languageParser.pick(['en', 'ar'], req?.headers?.['accept-language'] as string, { loose: true }) ?? 'en') as LangType,
    req,
    requestId: nanoid(),
    isAdmin: false,
    // TODO: add flags to user types
    isStudent: false,
    isSuperAdmin: false,
  }

  const tokenHeader = req?.headers?.authorization
  if (!tokenHeader) return context
  const token = tokenHeader.split(' ')[1]
  if (!token) return context

  try {
    const data = decode(token) as Payload
    const user = await db.collection<Account>(`accounts`).findOne({ username: data?.username, userType: data?.userType })
    const payload = verify(token, `${secrets.JWT_SECRET}${user?.userSigningKey}`) as Payload
    if (!payload || data?.type !== TokenType.ACCESS) return context

    context.isAdmin = user?.userType === UserType.ADMIN
    context.isStudent = user?.userType === UserType.STUDENT
    //  TODO: handle other types when they're added
    context.payload = { ...payload, user: new ObjectId(payload.user) }
    // context.isSuperAdmin = !!user?.isSuperAdmin

    return context
  } catch (e) {
    return context
  }
}
