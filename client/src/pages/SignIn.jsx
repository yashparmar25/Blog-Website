import { Alert, Button, Label, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Toaster, toast } from "react-hot-toast";
import { Link,useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { signInStart,signInSucces,signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
//redux persist is used to save the previous data in the redux
const SignIn = () => {
  const navigate=useNavigate();
  const [formData,setFormData]=useState({});
  const[loading,setLoading]=useState(false)
  const[errorMessage,setErrorMessage]=useState(null)
  const dispatch=useDispatch()
  const handlechange = (e)=>{
  setFormData({...formData,[e.target.id]:e.target.value});//spread operator which calls the previous data also like username, email and password etc and makes combination of it
  }
  console.log(formData)
  const handleSubmit = async (e)=>{ //async is used because there is the interaction with database which can take time so to prevent it async is used.
   e.preventDefault();
   //this method is used to not refreshing the page while going from frontend to the backend
   try{
    dispatch(signInStart())
    console.log('Form submitted')
    const res=await fetch('/api/auth/signin',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(formData),
    });
    const data=await res.json();

    if (data.success === false) 
    {
      toast.error('No Data Found!');
      dispatch(signInFailure(data.message ))
    }

    else
    {
    console.log('Sign Up successful')
    if(res.ok)
    {
      dispatch(signInSucces(data))
      navigate('/')
      toast.success('Sign Up Successful!');
    }
  }
  
   }
   catch(error)
   {
   console.log(error)
   dispatch(signInFailure(error.message))
   console.log('Failure in Sign-Up')
   }
  }

  return (
    <div className='flex gap-28 ml-[3rem] mt-[3rem] h-[26.1rem] overflow-y-hidden'>
      <Toaster />
    {/* left - container */}

      <div className='mt-[3.75rem] ml-[1rem]'>

      <Link  className='self-centre whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white mt-4' >
        <span className=' hover:text-black  px-2 text-white py-1 bg-gradient-to-r from-blue-500 via-violet-500 to-pink-400 rounded-lg text-4xl hover:duration-700'>Yash's</span>
        <span className='text-3xl ml-[0.5rem] text-gray-700 dark:text-white'>
        Blog
        </span>
        
        </Link>
        
        <p className='mt-[3rem] text-6xl drop-shadow-lg'>
          Create your own blog!
          <br />
          Let's Blog It.
          <hr className='mt-[1rem] '/>
        </p>
      </div>

      {/* right - container */}

      <div className='flex flex-col gap-8  ml-[2rem]'>
        <div className=' bg-gray-50 dark:bg-gray-800 w-[20rem] h-[20rem] rounded-3xl'>
        <form  id='form' onSubmit={handleSubmit} className='shadow-black drop-shadow-sm ml-[1rem] mt-[0.5rem] dark:shadow-white dark:drop-shadow-xl'>
       
        <div className=''>
        <label className='text-blue-800 dark:text-white'>Your Email</label>
        <br />
        <input className=" placeholder:text-gray-500  rounded-md px-16 shadow-lg sm:text-sm dark:text-white dark:bg-gray-600 dark:placeholder:text-white" placeholder="name@company.com" type="email" name="search" id='email' onChange={handlechange} required/>
        </div>
        <br />

        <div className=''>
        <label className='text-blue-800 dark:text-white'>Your Password</label>
        <br />
        <input className=" placeholder:text-gray-500 rounded-md px-16 shadow-lg sm:text-sm dark:text-white dark:bg-gray-600 dark:placeholder:text-white" placeholder="Password" type="password" name="search" id='password' onChange={handlechange} required/> 
        </div>

        <button className='w-[18.25rem] h-10 border rounded-md  text-white text-lg py-1 bg-gradient-to-r from-blue-500 via-violet-500 to-pink-400 mt-[2rem] shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:via-violet-500 hover:to-pink-500 hover:rounded-lg hover:duration-900'>
          Sign In</button>
          <OAuth></OAuth>
          
        </form>
        </div>

        <div className='flex gap-2 mt-[-0.9rem]'>
        <span className='mb-[0.5rem]'>Dont' have an Account?</span>
        <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
        </div>
        <hr className='dark:w-0'/>
      </div>
    </div>
  )
}

export default SignIn
