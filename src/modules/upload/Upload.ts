import { S3 } from 'aws-sdk'
import { pluck } from 'ramda'
import { nanoid } from 'nanoid'
import { ManagedUpload } from 'aws-sdk/clients/s3'

import fileUpload from 'express-fileupload'
import secrets from '../../secrets'
import { UploadResponse } from './types'

export class UploadService {
  // static async upload(files: fileUpload.UploadedFile[]): Promise<UploadResponse> {
  //   const filesUploadPromises = files.map(async (file) => {
  //     const entityId = nanoid()
  //     const path = `${secrets.S3_BUCKET}/upload/${entityId}.${file.mimetype.split('/')[1]}`
  //     const { Location } = await this.uploadFile({ file, path })
  //     return { url: Location, entityId }
  //   })
  //   const filesUpload = await Promise.all(filesUploadPromises)
  //   return { urls: pluck('url', filesUpload) }
  // }
  // static async uploadFile({ path, file }: { path: string; file: fileUpload.UploadedFile }): Promise<ManagedUpload.SendData> {
  //   const s3 = new S3({ accessKeyId: secrets.S3_ACCESS_KEY_ID, secretAccessKey: secrets.S3_ACCESS_KEY_SECRET, region: secrets.S3_REGION })
  //   return await new S3.ManagedUpload({
  //     params: { Bucket: secrets.S3_BUCKET, Key: path, Body: file.data, ContentType: file.mimetype, ACL: 'public-read' },
  //     service: s3,
  //   }).promise()
  // }
}
