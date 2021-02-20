import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useQuery, gql } from '@apollo/client'
import Image from 'next/image'
import { Hero } from 'components/Hero/Hero'

export const exampleQuery = gql`
  query example {
    example {
      message
    }
  }
`

const CreatePage = () => {
  const [session, loading] = useSession()
  if (loading) {
    return (
      <div className="flex justify-center mt-8 text-center">
        <div className="flex-auto">
          <div className="text-lg mb-2">Loading...</div>
        </div>
      </div>
    )
  }

  if (session) {
    return <Hero />
  } else {
    return (
      <div className="flex justify-center mt-8 text-center">
        <div className="flex-auto">
          <div className="text-lg mb-2">You are not logged in!</div>
          <button className="btn-green" onClick={() => signIn()}>
            Sign in
          </button>
        </div>
      </div>
    )
  }
}

export default CreatePage
