import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <section className='bg-gradient-to-b from-[#132d48] to-[#07090b] flex flex-row rounded-3xl px-16 py-6 items-center justify-between max-sm:px-4'>
        <div className='flex flex-col gap-6 max-w-lg'>
           <h2 className='text-2xl'>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
           <p className='text-lg'>Practice on real interview questions & get instant feedback</p>

           <Button asChild className='max-sm:w-full w-fit bg-[#82a5e1] text-dark-100 hover:bg-[#82a5e1]/80 rounded-full font-bold px-5 cursor-pointer min-h-10'>
            <Link href='/interview'>Start an Interview</Link>
           </Button>
        </div>

        <Image src='/robo.png' alt='robot' width={400} height={400} className='max-sm:hidden'/>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2 className='text-2xl font-semibold'>Your Interview</h2>
         
         <div className='flex flex-wrap gap-4 max-lg:flex-col w-full items-stretch'>
           {/* <p>You haven't taken any interview yet</p> */}
           {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
           ))}

         </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2 className='text-2xl font-semibold'>Take an Interview</h2>

        <div className='flex flex-wrap gap-4 max-lg:flex-col w-full items-stretch'>
          {/* <p>There are no interviews available</p> */}

          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
           ))}
        </div>
      </section>
    </>
  )
}

export default page