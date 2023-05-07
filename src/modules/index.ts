import path from 'path'
import { buildSchema } from 'type-graphql'
import Container from 'typedi'
import { GraphQLSchema } from 'graphql'
import { ObjectId } from 'mongodb'
import { ObjectIdScalar, ObjectScalarType } from '../common/scalars'
import { ErrorInterceptor } from '../errorHandlers/errorInterceptor'

export const createSchema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [path.join(__dirname, './**/{resolvers,resolver}.{js,ts}')],
    container: Container,
    globalMiddlewares: [ErrorInterceptor],
    scalarsMap: [
      { type: ObjectId, scalar: ObjectIdScalar },
      { type: Object, scalar: ObjectScalarType },
    ],
  })
}
