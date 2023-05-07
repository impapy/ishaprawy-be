import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class HealthCheckDbStatus {
  @Field()
  status: string

  @Field({ description: 'response time in milliseconds' })
  responseTime: number
}

@ObjectType()
export class HealthCheck {
  @Field()
  status: string

  @Field({ description: 'up time in seconds' })
  uptime: number

  @Field(() => HealthCheckDbStatus)
  db: HealthCheckDbStatus
}
