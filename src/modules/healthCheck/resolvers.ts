import { Service } from 'typedi'
import { Query, Resolver, FieldResolver } from 'type-graphql'
import { db } from '../../db'
import { HealthCheck, HealthCheckDbStatus } from './types'

@Service()
@Resolver(() => HealthCheck)
class HealthCheckResolver {
  @Query(() => HealthCheck)
  async hc(): Promise<Partial<HealthCheck>> {
    return {
      status: 'up',
      uptime: process.uptime(),
    }
  }

  @FieldResolver(() => HealthCheckDbStatus)
  async db(): Promise<HealthCheckDbStatus> {
    try {
      const timeBefore = Date.now()
      await db.command({ ping: 1 })
      const timeAfter = Date.now()

      return { status: 'up', responseTime: timeAfter - timeBefore }
    } catch (e) {
      return { status: 'down', responseTime: 0 }
    }
  }
}

export default HealthCheckResolver
