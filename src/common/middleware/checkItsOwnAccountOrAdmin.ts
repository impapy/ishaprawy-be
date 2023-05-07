import { MiddlewareFn } from 'type-graphql'
import { CustomError } from '../../errorHandlers/customError'
import { Context } from '../types'

export const CheckItsOwnAccountOrAdmin: MiddlewareFn<Context> = ({ context, args }, next) => {
  const { isAdmin, isStudent, payload } = context

  // not artist and not admin or artist but ids don't match
  // Cast ObjectId to string so we can compare them
  if ((isStudent && payload!.user + '' != args.sellerId) || (!isAdmin && !isStudent)) {
    throw new CustomError('UNAUTHORIZED')
  }

  return next()
}
