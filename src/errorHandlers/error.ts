/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { path } from 'ramda'
import { ApolloError, AuthenticationError } from 'apollo-server-express'
import { ArgumentValidationError } from 'type-graphql'
import { Context } from '../common/types'
import { getConstraints } from '../common/helpers'
import { CustomError, MessageType } from './customError'
import messages from './messages'

export const handleErrorInterceptor = (error: unknown, context: Context): CustomError | AuthenticationError | ApolloError => {
  if (error instanceof CustomError) {
    error.extra = { ...error.extra, requestId: context.requestId }
    error.message = messages[error.code]?.[context.lang]

    // replace any placeholders in the error message with their values in the extra object
    if (error.message) {
      for (const key in error.extra) {
        error.message = error.message.replace(`{${key}}`, error.extra[key as keyof typeof error.extra] as string)
      }
    }

    return error
  } else if (error instanceof ArgumentValidationError || path(['constructor', 'name'], error) === 'ArgumentValidationError') {
    const constrains = getConstraints(path(['validationErrors'], error)!)

    const message = <MessageType>Object.values(constrains)?.[0]
    return new CustomError(message, messages[message][context.lang])
  } else if (error instanceof AuthenticationError) {
    return error
  } else {
    console.log(error) // eslint-disable-line no-console
    return new ApolloError(messages.SERVER_ERROR[context.lang], '500')
  }
}

export const formatError = (error: any): any => {
  const isValidationError = error?.message?.startsWith('Variable "') || path(['extensions', 'code'], error) === 'GRAPHQL_VALIDATION_FAILED'
  const clientError = { ...error }
  if (
    !(error.originalError instanceof ApolloError) &&
    !(error.originalError instanceof CustomError) &&
    !(error instanceof CustomError) &&
    !(error.originalError instanceof AuthenticationError) &&
    !isValidationError
  ) {
    clientError.message = messages.SERVER_ERROR['en']
  }
  clientError.code = error?.originalError?.code
  delete clientError.extensions.exception
  return clientError
}
