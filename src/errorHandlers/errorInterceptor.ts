/* eslint-disable @typescript-eslint/no-explicit-any */
import { MiddlewareFn } from 'type-graphql'

import { Context } from '../common/types'
import { handleErrorInterceptor } from './error'

export const ErrorInterceptor: MiddlewareFn<any> = async ({ context }: { context: Context }, next) => {
  try {
    return await next()
  } catch (error) {
    return handleErrorInterceptor(error, context)
  }
}
