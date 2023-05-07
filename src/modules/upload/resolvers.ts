import { Request, Response } from 'express'
import { UploadService } from './Upload'

class UploadResolver {
  // static async upload(req: Request, res: Response): Promise<Response> {
  //   try {
  //     if (!req.files || !req.files.files) return res.send({ urls: [] })
  //     const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files]
  //     const { urls } = await UploadService.upload(files)
  //     return res.send({ urls })
  //   } catch (e) {
  //     res.send({ status: 500 })
  //     throw e
  //   }
  // }
}

export default UploadResolver
