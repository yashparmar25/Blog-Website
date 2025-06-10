import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {GoogleAuthProvider, signInWithPopup,getAuth} from 'firebase/auth'
import {app} from '../redux/firebase'
import { useDispatch } from 'react-redux'
import { signInFailure,signInSucces} from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
  const auth=getAuth(app)
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const handleGooglclick=async()=>{
  const provider= new GoogleAuthProvider()
  
  provider.setCustomParameters({prompt:'select_account'})
  try{
    const resultsFromGoogle=await signInWithPopup(auth,provider)
    // console.log(resultFromGoogle)
    const res=await fetch('/api/auth/google',{
      method:'POST',
      headers:{
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name:resultsFromGoogle.user.displayName,
        email:resultsFromGoogle.user.email,
        googlePhotoUrl:resultsFromGoogle.user.photoURL,
      })
    })
    const data= await res.json()
    if(data.success===false)
      {
        dispatch(signInFailure(data.message))
      }
      if(res.ok)
        {
         dispatch(signInSucces(data))
         navigate('/'); 
        }
  }
  
  catch(error)
  {
    console.log(error)
  }

  }

  return (
    <div className="">
    <div className='ml-[8.5rem] mt-[0.25rem]'>OR</div>
    <button type='button'  className='flex flex-col mt-[0.5rem] ml-[0rem] border-0 dark:border-white w-[18rem] h-[2.5rem] border-red-300 bg-gradient-to-b from-red-400 to-orange-600  text-white rounded-lg' onClick={handleGooglclick}>
    <div className='flex ml-[2.5rem] mt-[0.40rem] ' >
    <AiFillGoogleCircle className='w-6 h-6 mr-2 '/>
    <span className='text-lg mt-[-0.25rem]'>Continue with Google</span>
    </div>
    </button>
    </div>
  )
}

export default OAuth