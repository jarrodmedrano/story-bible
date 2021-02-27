import React, { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { Form, Input, Button, Switch, InputNumber } from 'antd'

type RequiredMark = boolean | 'optional'

import { Controller, useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'

const CREATE_STORY = gql`
  mutation storyMutation($data: StoryCreateInput!) {
    createOneStory(data: $data) {
      title
    }
  }
`

const CreateStory = () => {
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
    try {
      const newStory = await createOneStory({
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
          },
        },
      })

      setSuccessMessage(`${formData?.title} Successfully Submitted`)

      console.log('newStory', newStory)
    } catch (err) {
      console.log('err', err)
    }

    setIsSubmitting(false)
  }

  return (
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
          <Form.Item label="Published?">
            <Controller as={<Switch />} defaultValue="checked" name="published" control={control} />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
            <Button disabled={isSubmitting} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  )
}

export default CreateStory
