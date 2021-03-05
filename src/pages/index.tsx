import React from 'react'
import { useSession } from 'next-auth/client'
import { Hero } from 'components/Hero/Hero'
import LoginPage from './login/index'
import { Spin } from 'antd'

const IndexPage = () => {
  const [session, loading] = useSession()
  if (loading) {
    return <Spin />
  }

  if (session) {
    return <Hero />
  } else {
    return <LoginPage />
  }
}

export default IndexPage
