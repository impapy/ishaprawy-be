import { Service } from 'typedi'
import { DBCollections } from '../../common/types'
import createBaseService from '../../common/factories/createBaseService'
import { Admin } from './types'

@Service()
export class AdminService extends createBaseService(DBCollections.ADMINS)<Admin> {}
