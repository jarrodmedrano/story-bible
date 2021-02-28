import React from 'react'
import { useSession } from 'next-auth/client'
import LoginPage from '../login/index'
import { useQuery, gql } from '@apollo/client'
import { Spin } from 'antd'
import { Button } from 'antd'
import Link from 'next/link'
import { List, Avatar } from 'antd'

const GET_STORIES = gql`
  query stories($data: StoryWhereInput!) {
    stories(where: $data) {
      id
      title
      subTitle
    }
  }
`

const StoryPage = () => {
  const [session, loading] = useSession()
  const { loading: isLoading, error: storyError, data } = useQuery(GET_STORIES, {
    variables: {
      data: {
        authorId: {
          equals: session?.id,
        },
      },
    },
  })

  if (isLoading || loading) return <Spin />

  if (storyError) return <p>Error ${storyError}</p>

  if (session && data?.stories?.length > 0)
    return (
      <>
        <h2>Your Stories</h2>
        <List itemLayout="horizontal" dataSource={data.stories}>
          {data?.stories?.map((story) => {
            return (
              <List.Item key={story.id}>
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={
                    <Link href={`/story/${story.id}`}>
                      <p>
                        {story.title}
                        <br />
                        {story.subTitle}
                      </p>
                    </Link>
                  }
                />
              </List.Item>
            )
          })}
        </List>

        {!data.stories.length && <p>You don&apos;t have any Stories yet!</p>}
        <Link href="/story/create" passHref>
          <Button type="primary" htmlType="button">
            Create New
          </Button>
        </Link>
      </>
    )

  if (!session) {
    return <LoginPage />
  }
}

export default StoryPage
