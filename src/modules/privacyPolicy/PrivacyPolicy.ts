import { Service } from 'typedi'
import { db } from '../../db/index'
import { CustomError } from '../../errorHandlers/customError'
import { PrivacyPolicy, EditPrivacyPolicyArgs } from './types'

@Service()
export class PrivacyPolicyService {
  async all(): Promise<PrivacyPolicy> {
    const items = await db.collection<PrivacyPolicy>('privacyPolicy').find({}).sort({}).toArray()
    return items[0]
  }

  async edit({ content }: EditPrivacyPolicyArgs): Promise<PrivacyPolicy> {
    const now = new Date()

    const updateResult = await db.collection<PrivacyPolicy>('privacyPolicy').findOneAndUpdate(
      { isDeleted: false },
      {
        $set: {
          content,
          modifiedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { returnDocument: 'after', upsert: true },
    )
    if (!updateResult.value) throw new CustomError('PRIVACY_POLICY_NOT_FOUND')
    return updateResult.value
  }
}
