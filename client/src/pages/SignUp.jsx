import { Button, Label, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Toaster, toast } from "react-hot-toast";
import { Link,useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';
const SignUp = () => {
  const navigate=useNavigate();
  const [formData,setFormData]=useState({});
  const[loading,setLoading]=useState(false)
  const[errorMessage,setErrorMessage]=useState(null)
 
  const handlechange = (e)=>{
  setFormData({...formData,[e.target.id]:e.target.value});//spread operator which calls the previous data also like username, email and password etc and makes combination of it
  }
  console.log(formData)

  const handleSubmit = async (e)=>{ //async is used because there is the interaction with database which can take time so to prevent it async is used.
   e.preventDefault();
   
   //this method is used to not refreshing the page while going from frontend to the backend
   try{
    console.log('Form submitted')
    const res=await fetch('/api/auth/signup',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(formData),
    });
    const data=await res.json();

    if (data.success === false) 
    {
      toast.error('Duplicate data is found!');
      return setErrorMessage(data.message)
    } 
    else {
      toast.success('Sign Up Successful!');
      console.log('Sign Up successful')
      if(res.ok)
        {
      navigate('/sign-in')
    }}
  
   }
   catch(error)
   {
   console.log(error)
   setErrorMessage(error.message);
   setLoading(false);
   console.log('Failure in Sign-Up')
   }
  }

  return (
    <div className='flex gap-28 ml-[3rem] mt-[3rem] h-[26.1rem] rounded-lg '>
    {/* left - container */}

      <div className='mt-[3.75rem] ml-[1rem]'>

      <Link  className='self-centre whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white mt-4' >
        <span className=' hover:text-black  px-2 text-white py-1 bg-gradient-to-r from-blue-500 via-violet-500 to-pink-400 rounded-lg text-4xl hover:duration-700'>Yash's</span>
        <span className='text-3xl ml-[0.5rem] text-gray-700 dark:text-white'>
        Blog
        </span>
        
        </Link>
        
        <p className='mt-[3rem] text-6xl drop-shadow-lg'>
          Sign Up for Blogify
          <br />
          
          <hr className='mt-[1rem] '/>
        </p>
      </div>

      {/* right - container */}

      <div className='flex flex-col gap-8 mt-[-1rem] ml-[8rem] h-full overflow-y-hidden '>
       
        <form  id='form' onSubmit={handleSubmit} className='ml-[1rem]'>
        
        <div className=''>
        <label className='text-blue-800 dark:text-white'>Your Username</label>
        <br/>
        <input className=" placeholder:text-gray-500 rounded-md px-16 shadow-lg sm:text-sm dark:bg-gray-600 dark:placeholder:text-white " placeholder="Username" type="text" name="search" id='username' onChange={handlechange} required/> 
        </div>
        
       
        <div className='mt-[0.8rem]'>
        <label className='text-blue-800 dark:text-white '>Your Email</label>
        <br />
        <input className=" placeholder:text-gray-500 rounded-md px-16 shadow-lg sm:text-sm dark:bg-gray-600 dark:placeholder:text-white" placeholder="name@company.com" type="email" name="search" id='email' onChange={handlechange} required/>
        </div>
      

        <div className='mt-[0.8rem]'>
        <label className='text-blue-800 dark:text-white'>Your Password</label>
        <br />
        <input className=" placeholder:text-gray-500 rounded-md px-16 shadow-lg sm:text-sm dark:bg-gray-600 dark:placeholder:text-white" placeholder="Password" type="password" name="search" id='password' onChange={handlechange} required/> 
        </div>

        <button className='w-[18.25rem] h-10 border rounded-md  text-white text-lg py-1 bg-gradient-to-r from-blue-500 via-violet-500 to-pink-400 mt-[1.5rem] shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:via-violet-500 hover:to-pink-500 hover:rounded-lg hover:duration-900'>
          Sign Up </button>
          <OAuth></OAuth>
          <Toaster />
        </form>
        
  

        <div className='flex gap-2 mt-[-0.8rem]'>
        <span className='mb-[0.5rem] ml-[1rem]'>Have an Account?</span>
        <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
        </div>
        <hr className='dark:w-0'/>
      </div>
    </div>
  )
}

export default SignUp
