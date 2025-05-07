import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getFeedbackByinterviewId, getInterviewById } from '@/lib/actions/general.action';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({params}: RouteParams) => {
  const {id} = await params
 
  const user = await getCurrentUser();
  const interview = await getInterviewById(id)

  if(!interview) redirect('/')
    const feedback = await getFeedbackByinterviewId({
       interviewId: id,
       userId: user?.id!
    })

    // console.log(feedback)

  return (
    <section className='flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7'>
    <div className='flex flex-row justify-center'>
      <h1 className='text-4xl font-semibold'>
       Feedback on the Interview -{" "}
       <span className='capitalize'>{interview.role}</span> Interview
      </h1>
    </div>

    <div className='flex flex-row justify-center'>
      <div className='flex flex-row gap-5'>
        <div className='flex flex-row gap-2'>
        <Image src='/star.svg' alt='star' width={22} height={22} />
        <p>Overall Impression:{" "}
        <span className='text-[#82a5e1] font-bold'>
          {feedback?.totalScore}
        </span>
            /100
        </p>
        </div>

        <div className='flex flex-row gap-2'>
         <Image src='/calendar.svg' alt='calendar' width={22} height={22}/>
         <p>
          {feedback?.createdAt ? dayjs(feedback.createdAt).format("MMM DD, YYYY h:mm A") : "N/A"}
         </p>
        </div>
      </div>
    </div>

    <hr />

    <p>{feedback?.finalAssessment}</p>

    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>Breakdown of the Interview:</h2>
       {feedback?.categoryScores?.map((category, index) => (
        <div key={index}>
          <p className='font-bold'>
            {index + 1}. {category.name}
            ({category.score}/100)
          </p>
           <p>{category.comment}</p>
        </div>
       ))}
    </div>

    <div className='flex flex-col gap-3'>
      <h3 className='text-2xl font-bold'>Strengths</h3>
      <ul>
        {feedback?.strengths?.map((strength, index) => (
          <li key={index}>{strength}</li>
        ))}
      </ul>

    </div>

    <div className='flex flex-col gap-3'>
      <h3 className='text-2xl font-bold'>Areas for Improvement</h3>
      <ul>
        {feedback?.areasForImprovement?.map((area, index) => (
          <li key={index}>{area}</li>
        ))}
      </ul>
    </div>

    <div className='flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center'>
      <Button className=' w-fit bg-dark-200 text-[#82a5e1] hover:bg-dark-200/80 rounded-full font-bold px-5 cursor-pointer min-h-10'>
         <Link href='/' className='flex w-full'>
            <p className='text-sm font-semibold text-[#82a5e1] text-center'>
              Back to dashboard
            </p>
         </Link>
      </Button>

      <Button className=' w-fit  bg-[#82a5e1] hover:bg-[#82a5e1]/80 rounded-full font-bold px-5 cursor-pointer min-h-10'>
         <Link href={ `/interview/${id}`
          } className='flex w-full'>
            <p className='text-sm font-semibold text-[#030812] text-center'>
              Retake interview
            </p>
         </Link>
      </Button>
    </div>
    </section>
  )
}

export default page