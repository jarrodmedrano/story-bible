import React, { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { Form, Input, Button, Radio, Select, Switch } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

type RequiredMark = boolean | 'optional'

import { Hero } from 'components/Hero/Hero'
import LoginPage from '../login/index'

const StoryPage = () => {
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

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  if (session) {
    return (
      <>
        <h2>Create a New Story</h2>
        <Form
          {...layout}
          form={form}
          layout="horizontal"
          initialValues={{ requiredMark }}
          onValuesChange={onRequiredTypeChange}
          requiredMark={requiredMark}
        >
          <Form.Item label="Title" required tooltip="This is the name of your epic tale">
            <Input name="title" />
          </Form.Item>
          <Form.Item label="Sub Title" required tooltip="May I suggest Part Two: Electric Boogaloo">
            <Input name="subTitle" />
          </Form.Item>
          <Form.Item label="Series" required tooltip="Is your story part of an epic trilogy?">
            <Input name="series" />
          </Form.Item>
          <Form.Item label="Published?">
            <Switch />
          </Form.Item>
        </Form>
      </>
    )
  } else {
    return <LoginPage />
  }
}

export default StoryPage
