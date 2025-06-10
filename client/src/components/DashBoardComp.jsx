import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup} from 'react-icons/hi'

const DashBoardComp = () => {
  
    const[users,setUsers]=useState([])
    const[comments,setComments]=useState([])
    const[posts,setPosts]=useState([])
    const[totalUsers,setTotalUsers] = useState(0)
    const[totalPosts,setTotalPosts] = useState(0)
    const[totalComments,setTotalComments] = useState(0)
    const[lastMonthUsers,setLastMonthUsers] = useState(0)
    const[lastMonthPosts,setLastMonthPosts] = useState(0)
    const[lastMonthComments,setLastMonthComments] = useState(0)
    const{currentUser} = useSelector((state) => state.user)
    useEffect(()=>
    {
        
         const fetchUsers = async()=>{
        try
        {
         const res = await fetch('/api/user/getusers?limit=5') 
         const data = await res.json()
         if(res.ok)
         {
         setUsers(data.users)
         setTotalUsers(data.totalUsers)
         setLastMonthUsers(data.lastMonthUsers)
         }
         }

         catch(error)
        {
        console.log(error.message)   
        }
        }

        

         const fetchPosts = async() =>{

            try
            {
             const res = await fetch('/api/post/getposts') 
             const data = await res.json()
             if(res.ok)
             {
             setUsers(data.posts)
             setTotalUsers(data.totalPosts)
             setLastMonthUsers(data.lastMonthPosts)
             }
             }
    
             catch(error)
            {
            console.log(error.message)   
            }
         
         }
         
         const fetchComments = async()=> {
            try
            {
             const res = await fetch('/api/comment/getPostComments/:postId?limit=5') 
             const data = await res.json()
             if(res.ok)
             {
             setUsers(data.comments)
             setTotalUsers(data.totalComments)
             setLastMonthUsers(data.lastMonthComments)
             }
             }
    
             catch(error)
            {
            console.log(error.message)   
            }
         }

         if(currentUser.isAdmin)
        {
            fetchUsers()
            fetchPosts()
            fetchComments()
        }
    },[currentUser])


    return (
    <div className='p-3 md:mx-auto h-screen'>
        <div className="mt-[1rem] text-3xl ml-[20rem] font-bold ">DashBoard</div>
      <div className="flex-wrap flex gap-4 justify-center mt-[2rem]">
      
      <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
        
        <div className="flex justify-between">
            
            <div className="">
                <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
           
        </div>
        <div className="flex gap-2 text-sm">
                <span className='text-green-500 flex items-center'>
                   <HiArrowNarrowUp/>
                   {lastMonthUsers}
                </span>
                <div className="">Last Month</div>
        </div>

      </div>

      <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
        <div className="flex justify-between">
            <div className="">
                <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
                <p className='text-2xl'>{4}</p>
            </div>
            <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
           
        </div>
        <div className="flex gap-2 text-sm">
                <span className='text-green-500 flex items-center'>
                   <HiArrowNarrowUp/>
                   {4}
                </span>
                <div className="">Last Month</div>
        </div>

      </div>

      <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
        <div className="flex justify-between">
            <div className="">
                <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                <p className='text-2xl'>5</p>
            </div>
            <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
           
        </div>
        <div className="flex gap-2 text-sm">
                <span className='text-green-500 flex items-center'>
                   <HiArrowNarrowUp/>
                   4
                </span>
                <div className="">Last Month</div>
        </div>

      </div>
      </div>

      
      
    </div>
  )
}

export default DashBoardComp
