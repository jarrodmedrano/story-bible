import React from 'react'
import { Provider } from 'next-auth/client'
import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from 'graphql/apollo-client/client'
import { Layout, Menu } from 'antd'
import 'antd/dist/antd.css'
import Link from 'next/link'
import SubMenu from 'antd/lib/menu/SubMenu'
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs'

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
              <Menu.Item>
                <Link href="/" passHref>
                  Home
                </Link>
              </Menu.Item>
              <SubMenu key="SubMenu" title="Story">
                <Menu.Item key="setting:1">
                  <Link href="/story" passHref>
                    List
                  </Link>
                </Menu.Item>
                <Menu.Item key="setting:2">
                  <Link href="/story/create" passHref>
                    Create
                  </Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumbs></Breadcrumbs>
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
