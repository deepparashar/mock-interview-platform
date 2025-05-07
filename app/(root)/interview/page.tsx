import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'

const page = async () => {
  const user = await getCurrentUser();

  return (
    <>
       <h3 className='text-xl font-semibold'>Interview Generation</h3> 

       <Agent userName={user?.name} userId={user?.id} type="generate" />
    </>
  )
}

export default page