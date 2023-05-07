import { MiddlewareFn } from 'type-graphql'
import { CustomError } from '../../errorHandlers/customError'
import { Context } from '../types'

export const CheckIsAdmin: MiddlewareFn<Context> = ({ context: { isAdmin } }, next) => {
  if (!isAdmin) {
    throw new CustomError('UNAUTHORIZED')
  }

  return next()
}
