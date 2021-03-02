import axios from 'axios'

export interface IUploadDocumentsApi {
  (formData: FormData): Promise<IUploadDocumentsApiResponse>
}

export interface IUploadDocumentsApiResponse {
  success: boolean
  url: string
  moved?: string
  errors: {
    code: string
    category: string
    message: string
    data: any[]
  }[]
}

export const uploadDocumentsApi: IUploadDocumentsApi = async (request: FormData) => {
  const response = await axios({
    method: 'POST',
    data: request,
    url: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
  })
  return response.data
}
