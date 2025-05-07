'use client';

import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;

}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
    const [messages, setMessages] = useState<SavedMessage[]>([])
  
  
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED)

const onMessage = (message: Message) => {
  if(message.type === 'transcript' && message.transcriptType === 'final') {
    const newMessage = {role: message.role, content: message.transcript}

    setMessages((prev) => [...prev, newMessage])
  }
}

const onSpeechStart = () => setIsSpeaking(true);
const onSpeechEnd = () => setIsSpeaking(false)

const onError = (error: Error) => console.log('Error', error)

vapi.on('call-start', onCallStart)
vapi.on('call-end', onCallEnd)
vapi.on('message', onMessage)
vapi.on('speech-start', onSpeechStart);
vapi.on('speech-end', onSpeechEnd)
vapi.on('error', onError)

return () => {
vapi.off('call-start', onCallStart)
vapi.off('call-end', onCallEnd)
vapi.off('message', onMessage)
vapi.off('speech-start', onSpeechStart);
vapi.off('speech-end', onSpeechEnd)
vapi.off('error', onError)
}
}, [])

const handleGenerateFeedback = async (messages:SavedMessage[]) => {
  console.log('Generate Feedback')

  //TODO: Create a server action that generates feedback

  const {success, feedbackId: id} =await createFeedback({
    interviewId: interviewId!,
    userId: userId!,
    transcript: messages
  })

  if(success && id){
    router.push(`/interview/${interviewId}/feedback`)
  }else{
    console.log('Error saving feedback')

    router.push('/')
  }
}

useEffect(() => {

 if(callStatus === CallStatus.FINISHED){
  if(type === 'generate'){
    router.push('/')
  } else{
    handleGenerateFeedback(messages)
  }
 } 
}, [messages, callStatus, type, userId])

const handleCall = async () => {
  setCallStatus(CallStatus.CONNECTING)
  if(type === 'generate'){

    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
      variableValues: {
        username: userName,
        userid: userId
      }
    })
  }else{
    let formattedQuestions = '';

    if(questions){
      formattedQuestions = questions
      .map((question) => `-${question}`)
      .join('\n')
    }

    await vapi.start(interviewer, {
      variableValues :{
        questions:formattedQuestions
      }
    })
  }

}
const handleDisconnectCall = async () => {
  setCallStatus(CallStatus.FINISHED)

  vapi.stop()
}

const latestMessage = messages[messages.length -1]?.content

const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED

  return (
    <>
      <div className='flex sm:flex-row flex-col gap-10 items-center justify-between w-full'>

        {/* AI */}
        <div className=' bg-gradient-to-b  from-[#132d48] to-[#07090b] border-2 border-[#82a5e1]/50 p-0.5 rounded-2xl flex-1 sm:basis-1/2 w-full h-[400px]'>
          <div className='flex flex-col gap-2 justify-center items-center p-7 h-full rounded-2xl'>
            <div className='Avatar z-10 flex items-center justify-center bg-gradient-to-l from-[#c8e2ff] to-[#c5e4ff] rounded-full size-[120px] relative'>
              <Image src='/vapi.png' alt='vapi' width={65} height={54} className='object-cover' />
              {isSpeaking && (
                <span className='absolute inline-flex size-5/6 animate-ping rounded-full bg-[#82a5e1] opacity-75' />
              )}
            </div>
            <h3 className='text-xl font-semibold text-white'>Ai Interviewer</h3>
          </div>
        </div>

        {/* USER */}
        <div className='User border-2 border-[#24262c33] bg-gradient-to-b from-[#3f4042] to-[#1a1b1d33] p-0.5 rounded-2xl flex-1 sm:basis-1/2 w-full h-[400px] max-md:hidden'>
          <div className='flex flex-col gap-2 justify-center items-center p-7 h-full rounded-2xl'>
            <Image src='/user-avatar.png' alt='user' width={120} height={120} className='rounded-full object-cover size-[120px]' />
            <h3 className='text-xl font-semibold text-white'>{userName}</h3>
          </div>
        </div>

      </div>

      {messages.length > 0 && (
        <div className='bg-gradient-to-b from-[#7d8084] to-[#4B4D4F33] p-0.5 rounded-2xl w-full'>
          <div className='bg-gradient-to-b from-[#000305] to-[#08090D] rounded-2xl  min-h-12 px-5 py-3 flex items-center justify-center'>
            <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      {/* Call Control Button */}
      <div className='w-full flex justify-center'>
        {callStatus !== 'ACTIVE' ? (
          <button className='relative inline-block px-7 py-3 text-sm font-bold leading-5 text-white bg-green-600 transition-colors duration-150 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-green-700 min-w-28' onClick={handleCall}>
            <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')} />

            <span>
            {isCallInactiveOrFinished
              ? 'Call'
              : '. . .'}
            </span>
          </button>
        ) : (
          <button className='inline-block px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-destructive-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-destructive-200 hover:bg-destructive-200 min-w-28' onClick={handleDisconnectCall}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
