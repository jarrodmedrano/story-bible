import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { Form, Input, Button, Switch, InputNumber, Upload } from 'antd'
import Link from 'next/link'
import { UploadOutlined } from '@ant-design/icons'

type RequiredMark = boolean | 'optional'

import { Controller, useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import LoginPage from '../login/index'
import { uploadDocumentsApi } from '../api/files/uploadFileApi'
import Modal from 'antd/lib/modal/Modal'

const CREATE_STORY = gql`
  mutation storyMutation($data: StoryCreateInput!) {
    createOneStory(data: $data) {
      title
    }
  }
`

const UPLOAD_IMAGE = gql`
  mutation UploadImage($input: ImageInput!) {
    uploadImage(input: $input) {
      id
    }
  }
`

const Create = () => {
  const [previewImage, setPreviewImage] = useState('')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [fileList, setFileList] = useState([])
  const [file, setFile] = useState()
  const [createOneStory] = useMutation(CREATE_STORY)
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, control } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    shouldUnregister: true,
  })
  const [form] = Form.useForm()
  const [requiredMark, setRequiredMarkType] = useState<RequiredMark>('optional')
  const onRequiredTypeChange = ({ requiredMark }: { requiredMark: RequiredMark }) => {
    setRequiredMarkType(requiredMark)
  }

  useEffect(() => {
    console.log('fle', file)
  }, [file])

  const [session, loading] = useSession()
  if (loading) {
    return (
      <div className="flex justify-center mt-8 text-center">
        <div className="flex-auto">
          <div className="text-lg mb-2">Loading...</div>
        </div>
      </div>
    )
  }

  const onSubmit = async (formData, e) => {
    setIsSubmitting(true)

    let fileUrl = ''

    try {
      console.log('file', file)
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
      const fileUploaded = await uploadDocumentsApi(data)
      fileUrl = fileUploaded.url
    } catch (err) {
      console.log('error', err)
    }
    try {
      await createOneStory({
        variables: {
          data: {
            title: formData?.title,
            subTitle: formData?.subTitle,
            part: Number(formData.part),
            published: formData.published === 'checked' ? true : false,
            author: {
              connect: {
                id: session?.id,
              },
            },
            thumbnail: fileUrl ? fileUrl : null,
          },
        },
      })

      setSuccessMessage(`${formData?.title} Successfully Submitted`)
    } catch (err) {
      console.log('err', err)
    }

    setIsSubmitting(false)
  }

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl)
    setPreviewVisible(true)
  }

  const handleData = (file) => {
    setFile(file)
    return file
  }

  const handleChange = (e) => {
    setFileList(e.fileList)
  }

  return session ? (
    <>
      <h2>Create a New Story</h2>
      {successMessage ? (
        <div>
          <p>{successMessage}</p>

          <Button type="primary" htmlType="submit" onClick={() => setSuccessMessage('')}>
            Create Another
          </Button>
        </div>
      ) : (
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          initialValues={{ requiredMark }}
          onValuesChange={onRequiredTypeChange}
          requiredMark={requiredMark}
          onFinish={handleSubmit(onSubmit)}
        >
          <Form.Item
            label="Title"
            required
            tooltip="This is the name of your epic tale"
            hasFeedback
            rules={[{ required: true, message: 'Please enter your title!' }]}
          >
            <Controller disabled={isSubmitting} as={<Input />} name="title" control={control} defaultValue="" />
          </Form.Item>
          <Form.Item label="Sub Title" tooltip="May I suggest Part Two: Electric Boogaloo">
            <Controller disabled={isSubmitting} as={<Input />} name="subTitle" control={control} defaultValue="" />
          </Form.Item>
          <Form.Item label="Part" tooltip="What Part of the Series is it?">
            <Controller disabled={isSubmitting} as={<InputNumber />} name="part" control={control} defaultValue={1} />
          </Form.Item>
          <Form.Item label="Series" tooltip="Is your story part of an epic trilogy?">
            <Controller disabled={isSubmitting} as={<Input />} name="series" control={control} defaultValue="" />
          </Form.Item>
          <Form.Item label="Published?" valuePropName="checked">
            <Controller as={<Switch />} defaultValue={true} defaultChecked={true} name="published" control={control} />
          </Form.Item>
          <Form.Item label="Thumbnail">
            <Controller
              control={control}
              name="thumbnail"
              defaultValue=""
              render={() => (
                <>
                  <Upload
                    beforeUpload={handleData}
                    onChange={handleChange}
                    accept="image/png, image/jpg, image/jpeg"
                    onPreview={handlePreview}
                    listType="picture"
                  >
                    {fileList.length >= 1 ? null : <Button icon={<UploadOutlined />}>Upload</Button>}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </>
              )}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
            <Button disabled={isSubmitting} type="primary" htmlType="submit">
              Submit
            </Button>
            <Link href="/story" passHref>
              <Button type="dashed" htmlType="button">
                Cancel
              </Button>
            </Link>
          </Form.Item>
        </Form>
      )}
    </>
  ) : (
    <LoginPage />
  )
}

export default Create
