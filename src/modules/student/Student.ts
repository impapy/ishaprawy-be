import { Service } from 'typedi'
import * as R from 'ramda'
import { DBCollections, ResourcesSort } from '../../common/types'
import createBaseService from '../../common/factories/createBaseService'
import { Student, StudentsFilterInput, StudentsGetResponse } from './types'

@Service()
export class StudentService extends createBaseService(DBCollections.STUDENT)<Student> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Unreachable code error
  async all(
    filter: StudentsFilterInput,
    sort: any = ResourcesSort.NEWEST,
    page = 1,
    perPage = 30,
    filterFields: (keyof Omit<Student, 'isDeleted' | 'createdAt' | 'modifiedAt' | '_id'>)[],
  ): Promise<StudentsGetResponse> {
    return super.all(
      {
        ...R.omit(['stage'], filter),
        ...(filter.stage && { stage: { $in: filter.stage } }),
      },
      sort,
      page,
      perPage,
      filterFields,
    )
  }
}
