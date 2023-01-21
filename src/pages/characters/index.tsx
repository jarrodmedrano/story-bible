import React from 'react'
import { useSession } from 'next-auth/client'
import { useQuery, gql } from '@apollo/client'
import { Button, Card, Spin, Col, Row, Space } from 'antd'
const { Meta } = Card
import Link from 'next/link'
import withWrapper from 'components/withWrapper/withWrapper'

const GET_CHARACTERS = gql`
  query characters($data: CharacterWhereInput!) {
    characters(where: $data) {
      id
      name
    }
  }
`

const CharacterPage: React.FC = () => {
  const [session, loading] = useSession()
  const { loading: isLoading, error: storyError, data } = useQuery(GET_CHARACTERS, {
    variables: {
      data: {
        authorId: {
          equals: session?.id,
        },
      },
    },
  })

  if (isLoading || loading) return <Spin />

  if (storyError) return <p>Error Fetching Characters</p>

  return (
    <>
      {data?.characters?.length > 0 && (
        <>
          <Space direction="vertical">
            <Row gutter={[16, 16]}>
              <Col span={18} className="gutter-row">
                <h2>Your Characters</h2>
                <Space direction="vertical">
                  {!data.characters.length && <p>You don&apos;t have any Characters yet!</p>}
                  <Link href="/characters/create" passHref>
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
                {data?.characters?.map((story) => {
                  return (
                    <Space direction="vertical" key={story.id}>
                      <Link href={`/characters/${story.id}`}>
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
          </Space>
        </>
      )}
    </>
  )
}

export default withWrapper(CharacterPage)
