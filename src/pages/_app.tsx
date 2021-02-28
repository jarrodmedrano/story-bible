import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { Provider } from 'next-auth/client'
import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from 'graphql/apollo-client/client'
import { Layout, Menu, Breadcrumb } from 'antd'
import 'antd/dist/antd.css'

const { Header, Content, Footer } = Layout

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <Provider session={pageProps.session}>
      <ApolloProvider client={apolloClient}>
        <Layout className="layout" style={{ height: '100vh' }}>
          <Header style={{ background: 'white' }}>
            <div className="logo" />
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-content">
              <Component {...pageProps} />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>©2021 Created by Jarrod Medrano</Footer>
        </Layout>
      </ApolloProvider>
    </Provider>
  )
}
