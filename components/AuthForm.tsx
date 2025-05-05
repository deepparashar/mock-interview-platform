"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"



const authFormSchema =(type:FormType) => {
  return z.object({
   name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
   email: z.string().email(),
   password: z.string().min(3),
  })
}


const AuthForm = ({type}: {type: FormType}) => {
  const router = useRouter()
  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

 async function onSubmit(values: z.infer<typeof formSchema>) {
   try {
     if(type ==='sign-up'){
      const {name, email, password} = values;

      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

      const result = await signUp({
        uid: userCredentials.user.uid,
        name: name!,
        email,
        password,
      })

      if(!result?.success){
        toast.error(result?.message);
        return;
      }

      toast.success('Account created successfully. please sign in.')
      router.push('/sign-in')
    }else{

      const {email, password} = values;
      const userCredential = await signInWithEmailAndPassword(auth,email,password);

      const idToken = await userCredential.user.getIdToken();

      if(!idToken){
        toast.error('Sign in failed')
        return;
      }

      await signIn({
        email, idToken
      })

      toast.success('Sign in successfully.')
      router.push('/')
     }
   } catch (error) {
    toast.error(`Here is a Error: ${error}`)
   }
    console.log(values)
  }

  const isSignIn = type === 'sign-in'

  return (
    <div className="border bg-gradient-to-b from-[#575b5f] to-[#4B4D4F33] p-0.5 rounded-2xl w-fit h[400px] max-mdhidden lg:min-w-[566px]">

      <div className="flex flex-col gap-6 bg-gradient-to-b from-[#0b3a68] to-[#030d17] rounded-2xl min-h-full py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src='/logo.png' width={300} height={90} alt='' />
        </div>

        <h3 className="textcenter mt-3 text-2xl font-medium">Practice job intreview with AI</h3>
     

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 ">
          {!isSignIn && (
            <FormField 
            control={form.control} 
            name='name' 
            label="Name" 
            placeholder="Your Name" />
          )}
          <FormField 
            control={form.control} 
            name='email' 
            label="Email" 
            placeholder="Your email address"
            type="email"
             />

          <FormField 
            control={form.control} 
            name='password' 
            label="Password" 
            placeholder="Enter your password"
            type="password" 
             />
          <Button className="w-full bg-[#82a5e1] text-dark-100 hover:bg-[#82a5e1]/80 rounded-full min-h-10 font-bold px-5 cursor-pointer" type="submit">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
        </form>
      </Form>
       
       <p className="text-center">
        {isSignIn ? "No account yet?" : "Have an account already?"}
        <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold ml-1 text-[#82a5e1]">
        {!isSignIn ? 'sign-in' : 'sign-up'}
        </Link>
       </p>

    </div>
    </div>
  )
}

export default AuthForm