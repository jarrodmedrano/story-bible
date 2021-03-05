import React from 'react'
import { useSession } from 'next-auth/client'
import LoginPage from 'pages/login'
import { Spin } from 'antd'

export default function withWrapper(WrappedComponent: React.FC) {
  return function WrappedwithToast(props) {
    const [session, loading] = useSession()
    if (loading) return <Spin />

    if (!session) {
      return <LoginPage />
    }

    return (
      <div>
        <WrappedComponent displayName="WrappedComponent" {...props} />
      </div>
    )
  }
}
