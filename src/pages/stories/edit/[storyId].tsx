import React from 'react'
import { useSession } from 'next-auth/client'
import { useQuery, gql } from '@apollo/client'
import { Spin } from 'antd'
import StoryForm from 'components/Story/StoryForm'
import { useRouter } from 'next/router'

const GET_STORY = gql`
  query stories($data: StoryWhereInput!) {
    stories(where: $data) {
      id
      title
      subTitle
      thumbnail
      description
      part
      series {
        title
      }
      published
    }
  }
`

const Edit = () => {
  const [session] = useSession()
  const router = useRouter()

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

  return (
    <>
      <StoryForm storyToEdit={data?.stories?.[0]} formType="edit" />
    </>
  )
}

export default Edit
