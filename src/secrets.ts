export interface Secrets {
  DB_URL: string
  JWT_SECRET: string
  IS_PLAYGROUND_ENABLED: boolean
  IS_INTROSPECTION_ENABLED: boolean
}

const secrets: Secrets = {
  DB_URL: process.env.DB_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  IS_PLAYGROUND_ENABLED: process.env.IS_PLAYGROUND_ENABLED === 'true',
  IS_INTROSPECTION_ENABLED: process.env.IS_INTROSPECTION_ENABLED === 'true',
}

export default secrets
