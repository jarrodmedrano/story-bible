import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useQuery, gql } from '@apollo/client'
import Image from 'next/image'
import { Hero } from 'components/Hero/Hero'
import { Router } from 'next'
import LoginPage from '../login/index'

export const exampleQuery = gql`
  query example {
    example {
      message
    }
  }
`

const CharacterPage = () => {
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
    return <LoginPage />
  }
}

export default CharacterPage
