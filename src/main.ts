import 'reflect-metadata'
import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import { formatError } from './errorHandlers/error'
import { createSchema } from './modules'
import { connectToDB } from './db/index'
import context from './context'
import secrets from './secrets'
import MulterFileHandler from './common/middleware/multer'

const checkEnvVariables = () => {
  for (const key in secrets) {
    if (!secrets[key as keyof typeof secrets]) console.warn(`env variable ${key} is not set`) // eslint-disable-line no-console
  }
}

const main = async (): Promise<void> => {
  checkEnvVariables()
  await connectToDB()
  dotenv.config()
  const app = express()
  const { PORT = 3001 } = process.env

  const apolloServer = new ApolloServer({
    formatError,
    schema: await createSchema(),
    context,
    playground: secrets.IS_PLAYGROUND_ENABLED,
    introspection: secrets.IS_PLAYGROUND_ENABLED || secrets.IS_INTROSPECTION_ENABLED,
  })

  // upload
  app.use(cors())
  app.use(fileUpload({ useTempFiles: true }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  // app.post('/upload', UploadResolver.uploadtest)

  apolloServer.applyMiddleware({ app })
  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`server ready on http://localhost:${PORT}/graphql`))
}

main().catch((err) => console.log(err)) // eslint-disable-line no-console
