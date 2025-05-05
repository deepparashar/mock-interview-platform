import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

async function RootLayout({children}: {children:ReactNode}) {
  const isUserAuthenticated = await isAuthenticated();

  if(!isUserAuthenticated) redirect('/sign-in')

  return (
    <div className='flex mx-auto max-w-7xl flex-col gap-12 my-12 px-16 max-sm:px-4 max-sm:my-8'>
      <nav>
        <Link href='/' className='flex items-center gap-2'>
         <Image src='/logo.png' alt='Logo' width={125} height={32} /> 
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout