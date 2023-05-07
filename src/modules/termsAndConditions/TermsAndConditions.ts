import { Service } from 'typedi'
import { db } from '../../db/index'
import { CustomError } from '../../errorHandlers/customError'
import { TermsAndConditions, EditTermsAndConditionsArgs } from './types'

@Service()
export class TermsAndConditionsService {
  async all(): Promise<TermsAndConditions> {
    const items = await db.collection<TermsAndConditions>('termsAndConditions').find({}).sort({}).toArray()
    return items[0]
  }

  async edit({ content }: EditTermsAndConditionsArgs): Promise<TermsAndConditions> {
    const now = new Date()

    const updateResult = await db.collection<TermsAndConditions>('termsAndConditions').findOneAndUpdate(
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
    if (!updateResult.value) throw new CustomError('TERMS_AND_CONDITIONS_NOT_FOUND')
    return updateResult.value
  }
}
