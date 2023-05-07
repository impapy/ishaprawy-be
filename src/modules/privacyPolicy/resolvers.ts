import { Args, Ctx, Mutation, Resolver, Query } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../../common/types'
import { CustomError } from '../../errorHandlers/customError'
import { PrivacyPolicy, EditPrivacyPolicyArgs } from './types'
import { PrivacyPolicyService } from './PrivacyPolicy'

@Service()
@Resolver(() => PrivacyPolicy)
export class PrivacyPolicyResolver {
  constructor(private readonly privacyPolicyService: PrivacyPolicyService) {}

  @Query(() => PrivacyPolicy)
  async getPrivacyPolicy(): Promise<PrivacyPolicy> {
    return await this.privacyPolicyService.all()
  }

  @Mutation(() => PrivacyPolicy)
  async editPrivacyPolicy(@Args() args: EditPrivacyPolicyArgs, @Ctx() ctx: Context): Promise<PrivacyPolicy | null> {
    if (!ctx.isAdmin) throw new CustomError('UNAUTHORIZED')
    return this.privacyPolicyService.edit(args)
  }
}
