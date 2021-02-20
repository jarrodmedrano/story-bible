import { signIn, signOut, useSession } from 'next-auth/client'
import { useQuery, gql, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import classNames from 'classNames'
import React from 'react'

export const exampleQuery = gql`
  query example {
    example {
      message
    }
  }
`

export const Hero: React.FC = (props) => {
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {},
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
  })
  const [session, loading] = useSession()
  const { data, loading: queryLoading, refetch } = useQuery(exampleQuery, { notifyOnNetworkStatusChange: true })

  const onSubmit = (data, e) => {
    console.log('data', data)
    // e.target.reset(); // HTML standard reset() function will only reset inputs' value
  }

  return (
    <>
      <div className="text-lg mb-2">Hello, {session.user.email ?? session.user.name}</div>
      <div className="mb-2">
        gql test query: {queryLoading ? 'fetching...' : data?.example?.message}
        <button className="btn-blue ml-2" onClick={() => refetch()}>
          Refetch!
        </button>
      </div>
      <button className="btn-green" onClick={() => signOut()}>
        Sign out
      </button>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Create a Character</h2>
          <input name="name" ref={register} />
          <input name="age" type="number" ref={register} />
          <input type="submit" />
        </form>
      </div>
    </>
  )
}
