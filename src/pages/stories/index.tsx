import React from 'react'
import { useSession } from 'next-auth/client'
import { useQuery, gql } from '@apollo/client'
import { Button, Card, Spin, Col, Row, Space } from 'antd'
const { Meta } = Card
import Link from 'next/link'
import withWrapper from 'components/withWrapper/withWrapper'

const GET_STORIES = gql`
  query stories($data: StoryWhereInput!) {
    stories(where: $data) {
      id
      title
      subTitle
      thumbnail
      description
      part
    }
  }
`

const StoryPage: React.FC = () => {
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

  if (storyError) return <p>Error Fetching Stories</p>

  return (
    <>
      {data?.stories?.length > 0 && (
        <>
          <Row gutter={[16, 16]}>
            <Col span={4} className="gutter-row">
              <h2>Your Stories</h2>
              <Space direction="vertical">
                {!data.stories.length && <p>You don&apos;t have any Stories yet!</p>}
                <Link href="/stories/create" passHref>
                  <Button type="primary" htmlType="button">
                    Create New
                  </Button>
                </Link>
              </Space>
            </Col>
            <Col span={14} push={1} className="gutter-row"></Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={18} className="gutter-row">
              {data?.stories?.map((story) => {
                return (
                  <Space direction="vertical" key={story.id}>
                    <Link href={`/stories/${story.id}`}>
                      <div>
                        <Card
                          key={story.id}
                          hoverable
                          style={{ width: 240 }}
                          cover={
                            story.thumbnail ? (
                              <img
                                alt={story.title}
                                src={`https://res.cloudinary.com/slashclick/image/upload/v1614654910/${story.thumbnail}`}
                              />
                            ) : null
                          }
                        >
                          <Meta title={story.title} description={story.subTitle} />
                        </Card>
                      </div>
                    </Link>
                  </Space>
                )
              })}
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default withWrapper(StoryPage)
