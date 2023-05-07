import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql'
import { Service } from 'typedi'

import { CustomError } from '../../errorHandlers/customError'
import { AdminService } from '../../modules/admin/Admin'
import { Context } from '../types'
import { StudentService } from '../../modules/student/Student'

@Service()
export class Authenticate implements MiddlewareInterface<Context> {
  constructor(private readonly studentService: StudentService, private readonly adminService: AdminService) {}

  async use({ context }: ResolverData<Context>, next: NextFn) {
    if (!context.payload) {
      throw new CustomError('UNAUTHORIZED')
    }

    const [seller, admin] = await Promise.all([this.studentService.one({ _id: context.payload!.user }), this.adminService.one({ _id: context.payload!.user })])

    if (!seller && !admin) {
      throw new CustomError('UNAUTHORIZED')
    }

    return next()
  }
}
