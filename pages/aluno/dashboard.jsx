import { useSession } from 'next-auth/react'

export default function Dashboard () {

  const { data: session } = useSession()
  console.log(session)

  return (
    <h2>asd</h2>
  )
}
