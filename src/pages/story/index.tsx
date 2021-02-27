import React, { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { Form, Input, Button, Radio, Select, Switch, InputNumber } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

type RequiredMark = boolean | 'optional'

import LoginPage from '../login/index'
import { Controller, useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import prisma from 'pages/api/prisma'

const CREATE_STORY = gql`
  mutation storyMutation($data: StoryCreateInput!) {
    createOneStory(data: $data) {
      title
    }
  }
`

const StoryPage = () => {
  const [createOneStory] = useMutation(CREATE_STORY)
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
    console.log('f', prisma)

    const newStory = await prisma.story.create({
      data: {
        title: formData?.title,
        subTitle: formData?.subTitle,
        part: Number(formData.part),
        published: formData.published === 'checked' ? true : false,
        author: {
          connect: {
            id: 1,
            email: session?.user?.email,
          },
        },
      },
    })

    // createOneStory({
    //   variables: {
    //     data: {
    //       title: formData?.title,
    //       subTitle: formData?.subTitle,
    //       part: Number(formData.part),
    //       published: formData.published === 'checked' ? true : false,
    //       user: {
    //         connect: {
    //           id: session?.user?.name,
    //           email: session?.user?.email,
    //         },
    //       },
    //     },
    //   },
    // })
  }

  if (session) {
    return (
      <>
        <h2>Create a New Story</h2>
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
            <Controller as={<Input />} name="title" control={control} defaultValue="" />
          </Form.Item>
          <Form.Item label="Sub Title" tooltip="May I suggest Part Two: Electric Boogaloo">
            <Controller as={<Input />} name="subTitle" control={control} defaultValue="" />
          </Form.Item>
          <Form.Item label="Part" tooltip="What Part of the Series is it?">
            <Controller as={<InputNumber />} name="part" control={control} defaultValue={1} />
          </Form.Item>
          <Form.Item label="Series" tooltip="Is your story part of an epic trilogy?">
            <Controller as={<Input />} name="series" control={control} defaultValue="" />
          </Form.Item>
          <Form.Item label="Published?">
            <Controller as={<Switch />} defaultValue="checked" name="published" control={control} />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  } else {
    return <LoginPage />
  }
}

export default StoryPage
