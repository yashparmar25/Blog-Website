
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Table} from 'flowbite-react'
import { Link } from 'react-router-dom'

import {toast,Toaster} from 'react-hot-toast'
 const DashPosts = () => {
 const {currentUser}=useSelector((state)=>state.user)
 const [userPosts,setUserPosts] = useState([])
 const [showMore,setShowMore]=useState(true);
 const [showModal,setShowModal]=useState(false);
 const [postIdToDelete,setPostIdToDelete]=useState('');
 console.log(userPosts)

 useEffect(()=>{
 const fetchPosts =async()=>{

    try{
        const res= await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok)
        {
         setUserPosts(data.posts)
         if(data.posts.length<9)
         {
            setShowMore(false)
         }   

        }
    }

    catch(error)
    {
        console.log(error.message)
    }
}

if(currentUser.isAdmin)
{
fetchPosts()
}
},[currentUser._id])

const handleShowMore = async ()=>{
    const startIndex=userPosts.length;
    try{
        const res=await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
        const data = await res.json();
        if(res.ok)
        {
        setUserPosts((prev)=>[...prev,...data.posts])
        if(data.posts.length<9)
            {
                setShowMore(false)
            }
        }
    }
    catch(error)
    {
        console.log(error.message)
    }
}

const handleDeletePost= async()=>{
    setShowModal(false)
    try{
    const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
    {
     method:'DELETE',
    }
    )
    
    const data = await res.json();
    if(!res.ok)
    {
        console.log(data.message)
    }
    else
    {
        setUserPosts((prev)=>prev.filter((post)=> post._id!==postIdToDelete))
    }
    }
    catch(error)
    {
        console.log(error.message)
    }

}


return(
    <div className="ml-[10rem] table-auto p-2 h-[50rem]">
        {
            currentUser.isAdmin && userPosts.length> 0 ? (
                <>
                <table>
               
    <tr>
      <th className="p-8">Date Updated</th>
      <th className="p-8">Post Image</th>
      <th className="p-8">Post Title</th>
      <th className="p-8">Category</th>
      <th className="p-8">Delete</th>
      <th className="p-8">Edit</th>
    </tr>
    
    {
     userPosts.map((post)=>(
        <tbody className='divide-y ml-[2rem]'>
            
            <tr>
                <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                <td>
                <Link to={`/post/${post.slug}`}>
                <img src={post.image} alt={post.title} className='w-20 h-15 object-cover ml-[-3rem]'/>
                </Link>
                </td>

                <td>
                <Link to={`/post/${post.slug}`}>
                 {post.title}
                </Link>
                </td>

                <td>
                 {post.category}
                </td>

                <td>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' 
                    onClick={()=>{setShowModal(true);
                                  setPostIdToDelete(post._id)       
                    }}>Delete</span>
                </td>

                <td>
                <Link to={`/update-post/${post._id}`}>
                <span className='text-blue-500'>Edit</span>
                </Link>
                </td>
                
            </tr>
            </tbody>
     ))
    }
</table>
 
    {
      showMore && (
        <button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore}>
        Show more
        </button>
      )
    }
               </>
            ):(
                <p>You have no posts yet!</p>
            ) 
        }
        {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full mt-[3rem]">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                {/* Close Icon */}
                <span className="text-red-500 h-6 w-6 cursor-pointer" onClick={() => setShowModal(false)}>&times;</span>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Are you sure you want to delete this post?</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  This action cannot be undone. This will permanently delete your post and remove your data from our servers.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 w-full mt-8">
                <button
                  id="yes-btn"
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleDeletePost}
                >
                  Yes, Delete
                </button>
                <Toaster></Toaster>
                <button
                  id="cancel-btn"
                  className="px-4 py-2 bg-white text-red-500 text-base font-medium rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
)
}


export default DashPosts
