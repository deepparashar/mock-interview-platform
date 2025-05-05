import { getRandomInterviewCover } from '@/lib/utils';
import dayjs from 'dayjs'
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';

const InterviewCard = ({interviewId, userId, role, type, techstack, createdAt}: InterviewCardProps) => {
    const feedback = null as Feedback | null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now() ).format('MMM DD, YYYY');
  
  return (
    <div className='border bg-gradient-to-b from-[#575b5f] to-[#4B4D4F33] p-0.5 rounded-2xl w-[360px] max-sm:w-full min-h-96'>
        <div className='bg-gradient-to-b from-[#1A1C20] to-[#08090D] rounded-2xl min-h-full flex flex-col p-6 relative overflow-hidden gap-10 justify-between'>
          <div>
            <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
            <p className='text-sm font-semibold capitalize'>{normalizedType}</p>
            </div>

            <Image src={getRandomInterviewCover()} alt='cover' width={90} height={90} className='rounded-full object-fit  size-[90px]'/>

            <h3 className='mt-5 capitalize'>
             {role} Interview
            </h3>

            <div className='flex flex-row gap-5 mt-3'>
              <div className='flex flex-row gap-2'>
                <Image src='/calendar.svg' alt='calender' width={22} height={22}/>
                <p>{formattedDate}</p>
              </div>
                  <div className='flex flex-row gap-2 items-center'>
                    <Image src='/star.svg' alt='star' width={22} height={22} />
                    <p>{feedback?.totalScore || '___'}/100</p>
                  </div>
            </div>

            <p className='line-clamp-2 mt-5'>
                {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}
            </p>
          </div>

          <div className='flex flex-row justify-between'>
              {/* <p>Tech Icons</p> */}
              <DisplayTechIcons techStack={techstack}/>

              <Button className='w-fit bg-[#82a5e1] text-dark-100 hover:bg-[#82a5e1]/80 rounded-full font-bold px-5 cursor-pointer min-h-10'>
                <Link href={feedback 
                ? `/interview/${interviewId}/feedback` 
                  : `interview/${interviewId}`
                  }>
                  {feedback ? 'Check Feedback' : 'View Interview'}
                </Link>
              </Button>
          </div>
        </div>
    </div>
  )
}

export default InterviewCard