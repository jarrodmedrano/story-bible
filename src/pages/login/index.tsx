import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'

export default function LoginPage() {
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
