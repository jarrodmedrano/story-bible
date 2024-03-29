import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/client'
import { Form, Input, Button, Switch, InputNumber, Upload, Spin, Select, Divider } from 'antd'
import Link from 'next/link'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'

type RequiredMark = boolean | 'optional'

import { Controller, useForm } from 'react-hook-form'
import { gql, useMutation, useQuery } from '@apollo/client'
import { uploadDocumentsApi } from '../../pages/api/files/uploadFileApi'
import Modal from 'antd/lib/modal/Modal'
import removeEmpty from '../../util/removeEmpty'

const CREATE_STORY = gql`
  mutation storyMutation($data: StoryCreateInput!) {
    createOneStory(data: $data) {
      title
    }
  }
`

const UPDATE_STORY = gql`
  mutation storyMutation($data: StoryUpdateInput!, $where: StoryWhereUniqueInput!) {
    updateOneStory(data: $data, where: $where) {
      title
    }
  }
`

const DELETE_STORY = gql`
  mutation storyMutation($where: StoryWhereUniqueInput!) {
    deleteOneStory(where: $where) {
      title
    }
  }
`
const GET_SERIES = gql`
  query series($where: SeriesWhereInput!) {
    series(where: $where) {
      id
      title
    }
  }
`

const StoryForm = (props) => {
  const { formType, storyToEdit } = props
  const [previewImage, setPreviewImage] = useState('')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [fileList, setFileList] = useState([])
  const [file, setFile] = useState()
  const [updateOneStory] = useMutation(UPDATE_STORY)
  const [deleteOneStory] = useMutation(DELETE_STORY)
  const [createOneStory] = useMutation(CREATE_STORY)
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { handleSubmit, control } = useForm({
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
  const [session, loading] = useSession()
  const [dropdownList, setDropdownList] = useState([])
  const [seriesName, setSeriesName] = useState('')

  const { loading: isLoading, data: seriesData } = useQuery(GET_SERIES, {
    variables: {
      where: {
        authorId: {
          equals: session?.id,
        },
      },
    },
  })

  useEffect(() => {
    setDropdownList(seriesData?.series)
  }, [seriesData])

  if (loading || isLoading) {
    return (
      <div className="flex justify-center mt-8 text-center">
        <div className="flex-auto">
          <div className="text-lg mb-2">
            <Spin />
          </div>
        </div>
      </div>
    )
  }

  const addItem = () => {
    console.log('me', dropdownList)
    const dupe = dropdownList.find((item) => item.title === seriesName)

    if (!dupe && seriesName) {
      setDropdownList([
        ...dropdownList,
        {
          title: seriesName,
        },
      ])

      setSeriesName('')
    } else {
      setDropdownList([...dropdownList])
    }
  }

  const onDelete = async () => {
    try {
      await deleteOneStory({
        variables: {
          where: {
            id: storyToEdit.id,
          },
        },
      })

      setSuccessMessage(`${storyToEdit?.title} Successfully Deleted`)
    } catch (err) {
      console.log('err', err)
    }
  }

  const onSubmit = async (formData) => {
    setIsSubmitting(true)

    let fileUrl = ''
    if (file) {
      try {
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
        const fileUploaded = await uploadDocumentsApi(data)
        fileUrl = fileUploaded.public_id
      } catch (err) {
        console.log('error', err)
      }
    }

    const newData = {
      description: formData?.description,
      part: Number(formData.part),
      published: formData.published === 'checked' ? true : false,
      subTitle: formData?.subTitle,
      title: formData?.title,
      author: {
        connect: {
          id: session?.id,
        },
      },
      thumbnail: fileUrl ? fileUrl : storyToEdit?.thumbnail,
    }

    const cleanData = removeEmpty(newData)
    const foundSeries = dropdownList.find((item) => item.title === formData?.series)

    if (!storyToEdit) {
      try {
        const cleanSeries = foundSeries
          ? removeEmpty({
              series: {
                connect: {
                  id: foundSeries?.series,
                },
              },
            })
          : formData?.series
          ? removeEmpty({
              series: {
                create: {
                  author: {
                    connect: {
                      id: session?.id,
                    },
                  },
                  title: formData?.series,
                },
              },
            })
          : null

        await createOneStory({
          variables: {
            data: {
              ...cleanData,
              ...cleanSeries,
            },
          },
        })

        setSuccessMessage(`${formData?.title} Successfully Submitted`)
      } catch (err) {
        console.log('err', err)
      }
    } else {
      try {
        const cleanSeries = foundSeries
          ? removeEmpty({
              series: {
                connect: {
                  id: foundSeries?.series,
                },
              },
            })
          : formData?.series
          ? removeEmpty({
              series: {
                update: {
                  author: {
                    connect: {
                      id: session?.id,
                    },
                  },
                  title: formData?.series,
                },
              },
            })
          : null

        await updateOneStory({
          variables: {
            data: {
              ...cleanData,
              ...cleanSeries,
            },
            where: {
              id: storyToEdit?.id,
            },
          },
        })

        setSuccessMessage(`${formData?.title} Successfully Submitted`)
      } catch (err) {
        console.log('err', err)
      }
    }

    setIsSubmitting(false)
  }

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = (file) => {
    setPreviewImage(
      file.url || file.thumbUrl || storyToEdit.thumbnail
        ? `https://res.cloudinary.com/slashclick/image/upload/v1614654910/${storyToEdit.thumbnail}`
        : null,
    )
    setPreviewVisible(true)
  }

  const handleData = (file) => {
    setFile(file)
    return file
  }

  const handleChange = (e) => {
    setFileList(e.fileList)
  }

  const onNameChange = (event) => {
    setSeriesName(event.target.value)
  }

  return (
    <>
      {formType === 'create' && <h2>Create a New Story</h2>}

      {formType === 'edit' && <h2>Edit Story</h2>}

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
          onFinish={handleSubmit(onSubmit)}
        >
          <Form.Item
            label="Title"
            required
            tooltip="This is the name of your epic tale"
            hasFeedback
            rules={[{ required: true, message: 'Please enter your title!' }]}
          >
            <Controller
              defaultValue={storyToEdit?.title}
              disabled={isSubmitting}
              render={({ onChange, value }) => <Input onChange={onChange} value={value} />}
              name="title"
              control={control}
              rules={{ required: true }}
            />
          </Form.Item>
          <Form.Item label="Sub Title" tooltip="May I suggest Part Two: Electric Boogaloo">
            <Controller
              defaultValue={storyToEdit?.subTitle}
              disabled={isSubmitting}
              as={<Input />}
              name="subTitle"
              control={control}
            />
          </Form.Item>
          <Form.Item label="Part" tooltip="What Part of the Series is it?">
            <Controller
              defaultValue={storyToEdit?.part}
              disabled={isSubmitting}
              as={<InputNumber />}
              name="part"
              control={control}
            />
          </Form.Item>
          {dropdownList && (
            <Form.Item label="Select Series" tooltip="Is your story part of an epic trilogy?">
              <Controller
                as={
                  <Select
                    defaultValue={storyToEdit?.series?.title}
                    onChange={handleChange}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <Divider style={{ margin: '4px 0' }} />
                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                          <Input style={{ flex: 'auto' }} onChange={onNameChange} />
                          <a
                            style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                            onClick={addItem}
                          >
                            <PlusOutlined /> Add item
                          </a>
                        </div>
                      </div>
                    )}
                  >
                    {dropdownList.map((seriesItem) => {
                      return (
                        <Select.Option key={seriesItem.title} value={seriesItem.title}>
                          {seriesItem.title}
                        </Select.Option>
                      )
                    })}
                  </Select>
                }
                control={control}
                defaultValue={storyToEdit?.series?.title}
                disabled={isSubmitting}
                name="series"
              />
            </Form.Item>
          )}

          {/* <Form.Item label="New Series" tooltip="Enter a new Series">
            <Controller
              as={<Input />}
              control={control}
              defaultValue={storyToEdit?.series?.title}
              disabled={isSubmitting}
              name="series"
            />
          </Form.Item> */}
          <Form.Item label="Published?" valuePropName="checked">
            <Controller
              as={<Switch />}
              control={control}
              defaultValue={storyToEdit?.published || true}
              defaultChecked={storyToEdit?.published || true}
              name="published"
            />
          </Form.Item>
          <Form.Item label="Description">
            <Controller
              as={<Input.TextArea />}
              control={control}
              defaultValue={storyToEdit?.description}
              name="description"
            />
          </Form.Item>
          <Form.Item label="Thumbnail">
            <Controller
              control={control}
              name="thumbnail"
              defaultValue={storyToEdit?.thumbnail}
              render={() => (
                <>
                  <Upload
                    accept="image/png, image/jpg, image/jpeg"
                    beforeUpload={handleData}
                    listType="picture"
                    onChange={handleChange}
                    onPreview={handlePreview}
                    defaultFileList={
                      storyToEdit?.thumbnail && [
                        {
                          uid: '1',
                          name: storyToEdit?.thumbnail,
                          status: 'done',
                          size: 0,
                          type: '.jpg',
                          url: `https://res.cloudinary.com/slashclick/image/upload/v1614654910/storyBible/${storyToEdit?.thumbnail}.jpg`,
                        },
                      ]
                    }
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
            <Link href="/stories" passHref>
              <Button type="dashed" htmlType="button">
                Cancel
              </Button>
            </Link>
          </Form.Item>
          {storyToEdit && (
            <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
              <Button onClick={onDelete} type="dashed" htmlType="button">
                Delete
              </Button>
            </Form.Item>
          )}
        </Form>
      )}
    </>
  )
}

export default StoryForm
