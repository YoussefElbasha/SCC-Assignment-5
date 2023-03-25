import { Request, Response } from 'express'
import AWS from 'aws-sdk'

const deleteObject = async (req: Request, res: Response) => {
  try {
    const accessKey: any = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey: any = process.env.AWS_SECRET_ACCESS_KEY
    const bucketName: any = process.env.BUCKET_NAME

    const s3 = new AWS.S3({ credentials: { accessKeyId: accessKey, secretAccessKey: secretAccessKey } })

    const { key }: any = req.query

    if (!key) throw new Error('No file name present')

    const deleteObject = await s3.deleteObject({
      Bucket: bucketName,
      Key: key
    }).promise()

    return res.status(200).json({ response: 'yay' })
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}

export default deleteObject