import React from 'react'
import { useSession } from 'next-auth/client'
import { useQuery, gql } from '@apollo/client'
import { Card, Spin } from 'antd'
import { Button } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Meta } from 'antd/lib/list/Item'

const GET_STORY = gql`
  query stories($data: StoryWhereInput!) {
    stories(where: $data) {
      id
      title
      subTitle
      thumbnail
      description
      part
      published
    }
  }
`

const EditPage = () => {
  const router = useRouter()

  const [session] = useSession()
  const { loading, error: storyError, data } = useQuery(GET_STORY, {
    variables: {
      data: {
        authorId: {
          equals: session?.id,
        },
        id: {
          equals: Number(router?.query?.storyId),
        },
      },
    },
  })

  if (loading) return <Spin />

  if (storyError) return <p>Error </p>

  if (data?.stories?.length > 0) {
    const story = data.stories[0]

    return (
      <>
        {!data.stories.length && <p>You don&apos;t have any Stories yet!</p>}
        <h1>{story.title}</h1>
        <h2>{story.subTitle}</h2>

        <Card
          key={story.id}
          hoverable
          style={{ width: 240 }}
          cover={
            <img
              alt={story.title}
              src={`https://res.cloudinary.com/slashclick/image/upload/v1614654910/${story?.thumbnail}`}
            />
          }
        >
          <Meta title={story.title} description={story.description} />
        </Card>
        <Link href="/stories/create" passHref>
          <Button type="primary" htmlType="button">
            Create New
          </Button>
        </Link>

        <Link href={`/stories/edit/${story.id}`} passHref>
          <Button type="default" htmlType="button">
            Edit Story
          </Button>
        </Link>
      </>
    )
  }
}

export default EditPage
