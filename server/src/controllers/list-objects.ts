import { Request, Response } from 'express'
import AWS from 'aws-sdk'

const listAllObjects = async (req: Request, res: Response) => {
  try {

    const accessKey: any = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey: any = process.env.AWS_SECRET_ACCESS_KEY
    const bucketName: any = process.env.BUCKET_NAME

    const s3 = new AWS.S3({ credentials: { accessKeyId: accessKey, secretAccessKey: secretAccessKey } })

    const objects = await s3.listObjectsV2({
      Bucket: 'ssc.assignment.5',
      Prefix: 'files/'
    }).promise()

    const finalObjects = objects.Contents?.filter((file: any) => file.Size > 0).map((object) => { return ({ name: object.Key?.replace('files/', '') }) })

    return res.status(200).json({ objects: finalObjects })
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}

export default listAllObjects