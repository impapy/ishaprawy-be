import { Service } from 'typedi'
import { Args, Mutation, Query, Resolver, Ctx, FieldResolver, Root, Arg, UseMiddleware } from 'type-graphql'
import { equals, omit } from 'ramda'
import { ObjectId } from 'mongodb'
import { Context } from '../../common/types'
import { CustomError } from '../../errorHandlers/customError'
import { Stage, UserType } from '../account/types'
import { transaction } from '../../common/transaction'
import { Authenticate } from '../../common/middleware/authenticate'
import { CheckIsAdmin } from '../../common/middleware/checkIsAdmin'
import { AccountService } from '../account/Account'
import { AdminService } from './Admin'
import { Admin, AdminsGetInput, AdminsGetResponse, AdminAddInput, AdminEditInput } from './types'

@Service()
@Resolver(() => Admin)
class AdminResolver {
  constructor(private readonly adminService: AdminService, private readonly accountService: AccountService) {}

  @Query(() => Admin)
  async admin(@Arg('adminId') _id: ObjectId, @Ctx() ctx: Context): Promise<Admin | null> {
    if (!ctx.isAdmin) throw new CustomError('UNAUTHORIZED')
    return this.adminService.one(_id)
  }

  // @UseMiddleware(Authenticate, CheckIsAdmin)
  @Query(() => AdminsGetResponse)
  async admins(@Arg('input', { defaultValue: {} }) { filter = {}, sort, page, perPage }: AdminsGetInput): Promise<AdminsGetResponse> {
    return await this.adminService.all(filter, sort, page, perPage, ['name'])
  }

  // @UseMiddleware(Authenticate, CheckIsAdmin)
  @Mutation(() => Admin)
  async adminAdd(@Arg('input') input: AdminAddInput): Promise<Admin> {
    let isSuperAdmin = false

    const isSuperAdminNotExist = !(await this.adminService.one({}))

    if (isSuperAdminNotExist) {
      isSuperAdmin = true
    }

    return await transaction(async (session) => {
      const admin = await this.adminService.add(
        { ...omit(['username', 'password'], input), isSuperAdmin, isSuspended: false, userType: UserType.ADMIN },
        session,
      )
      await this.accountService.add({ user: admin._id, ...input, userType: UserType.ADMIN }, session)
      return admin
    })
  }

  @Mutation(() => Admin)
  async adminEdit(@Arg('update', { defaultValue: {} }) update: AdminEditInput, @Ctx() ctx: Context): Promise<Admin> {
    if ((!ctx.isSuperAdmin && !ctx.isAdmin) || !ctx?.payload?.user) throw new CustomError('UNAUTHORIZED')

    return await this.adminService.edit(ctx?.payload?.user, update)
  }

  @Mutation(() => Admin)
  async adminDelete(@Arg('_id') _id: ObjectId, @Ctx() ctx: Context): Promise<ObjectId | undefined> {
    if (!ctx.isSuperAdmin || equals(_id.toHexString(), ctx.payload?.user?.toHexString?.())) throw new CustomError('UNAUTHORIZED')

    return await this.adminService.delete({ _id })
  }

  @Query(() => Admin)
  async getCurrentAdmin(@Ctx() ctx: Context): Promise<Admin | null> {
    if (!ctx.isAdmin || !ctx?.payload?.user) throw new CustomError('UNAUTHORIZED')
    return this.adminService.one(ctx?.payload?.user)
  }

  @FieldResolver(() => String)
  async username(@Root() admin: Admin): Promise<string | null> {
    if (!admin._id) return null
    const adminAccount = await this.accountService.one({ user: admin._id })
    return adminAccount?.username || null
  }
}

export default AdminResolver
