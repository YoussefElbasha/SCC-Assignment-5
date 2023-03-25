import { Request, Response } from 'express'
import AWS from 'aws-sdk'
import { v4 as uuid } from 'uuid';

const uploadObject = async (req: Request, res: Response) => {
  try {

    const { file }: any = req

    if (!file) throw new Error('A file is required')

    let myFile = file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const accessKey: any = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey: any = process.env.AWS_SECRET_ACCESS_KEY
    const bucketName: any = process.env.BUCKET_NAME

    const s3 = new AWS.S3({ credentials: { accessKeyId: accessKey, secretAccessKey: secretAccessKey } })

    const putObject = await s3.putObject({
      Bucket: bucketName,
      Key: `${uuid()}.${fileType}`,
      Body: file?.buffer,
      ContentType: file?.mimetype
    }).promise()

    return res.status(200).json({ response: 'yay' })
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}

export default uploadObject
