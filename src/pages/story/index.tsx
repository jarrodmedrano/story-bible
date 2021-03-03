import React from 'react'
import { useSession } from 'next-auth/client'
import LoginPage from '../login/index'
import { useQuery, gql } from '@apollo/client'
import { Button, Card, Spin, Col, Row } from 'antd'
const { Meta } = Card
import Link from 'next/link'

const GET_STORIES = gql`
  query stories($data: StoryWhereInput!) {
    stories(where: $data) {
      id
      title
      subTitle
      thumbnail
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
        <Row gutter={16}>
          {data?.stories?.map((story) => {
            return (
              <Col span={8} key={story.id}>
                <Link href={`/story/${story.id}`} passHref prefetch>
                  <Card
                    key={story.id}
                    hoverable
                    style={{ width: 240 }}
                    cover={
                      <img
                        alt={story.title}
                        src={`https://res.cloudinary.com/slashclick/image/upload/v1614654910/${story.thumbnail}`}
                      />
                    }
                  >
                    <Meta title={story.title} description={story.description} />
                  </Card>
                </Link>
              </Col>
            )
          })}
        </Row>

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
