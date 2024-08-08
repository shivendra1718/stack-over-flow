"use client"
import { useAuthStore } from '@/store/auth'
import React from 'react'
import { cn } from '@/lib/utils'

const BottomGradient = () =>{
    return (
        <>
       <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
       <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    )
}
 const LabelInputContainer = ({children, classname}:{children:React.ReactNode,classname:string}) =>{
    return <div className={cn("flex w-full flex-col space-y-2",classname)}>{children}</div>
}

function signUpPage() {
    const {createAccount,login} = useAuthStore()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        //collect data
         const formData = new FormData(e.currentTarget)
         const firstname = formData.get("firstname")
         const lastname = formData.get("lastname")
         const email = formData.get("email")
         const password = formData.get("password")
         // validate
         if (!firstname||!email||!lastname||!password) {
                setError(()=>"Please fill out the all field !! all field required") 
                return
         }
        // call the store
        setLoading(true)
        setError("")
        const respone = await createAccount(`${firstname} ${lastname}`,email?.toString(),password?.toString())
        if (respone.error) {
            setError(()=> respone.error!.message)
            
        }
         const loginRespose = await login(email.toString(), password.toString())

         if (loginRespose.error) {
            setError(()=> loginRespose.error!.message)
            
         }
         setLoading(()=> false)

    }






  return (
 
    <div className='"mx-auto w-full max-w-md rounded-none border border-solid border-white/30 bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8"'>
            <h2 className='"text-xl font-bold text-neutral-800 dark:text-neutral-200"'>
                        Welcome to StackOverFlow
            </h2>
    </div>
    
  )
}

export default signUpPage