
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Table} from 'flowbite-react'
import { Link } from 'react-router-dom'
import {toast,Toaster} from 'react-hot-toast'
import { FaCheck, FaTimes } from 'react-icons/fa'
 const DashUsers = () => {
 const {currentUser}=useSelector((state)=>state.user)
 const [users,setUsers] = useState([])
 const [showMore,setShowMore]=useState(true);
 const [showModal,setShowModal]=useState(false);
 const [userIdToDelete,setUserIdToDelete]=useState('');


 const handleDeleteUser = async ()=>{
 try{
     const res = await fetch(`/api/user/delete/${userIdToDelete}`,{
        method:'DELETE',
     });
     const data= await res.json();
     if(res.ok)
     {
      setUsers((prev)=>prev.filter((user)=>user._id !== userIdToDelete))
      setShowModal(false);
     }
      else{
        console.log(data.messsage)
      }
    }
    catch(error)
    {
        
    }
 }

 useEffect(()=>{
 const fetchUsers =async()=>{

    try{
        const res= await fetch(`/api/user/getusers`)
        const data = await res.json()
        if(res.ok)
        {
         setUsers(data.users)
         if(data.users.length<9)
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
fetchUsers()
}
},[currentUser._id])

const handleShowMore = async ()=>{
    const startIndex=users.length;
    try{
        const res=await fetch(`/api/user/getusers?startIndex=${startIndex}`)
        const data = await res.json();
        if(res.ok)
        {
        setUsers((prev)=>[...prev,...data.users])
        if(data.users.length<9)
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

return(
    <div className="ml-[5rem]">
        {
            currentUser.isAdmin && users.length > 0 ? (
                <>
                <table>
    <tr className='px-4'>
      <th className="p-6">Date Created</th>
      <th className="p-6">User Image</th>
      <th className="p-6">Username</th>
      <th className="p-6">Email</th>
      <th className="p-6">Admin</th>
      <th className="p-6">Delete</th>
      
    </tr>
    
    {
     users.map((user)=>(
        <tbody className='divide-y ml-[2rem]' key={user._id}>
            
            <tr className='px-8'>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                
                <img src={user.profilePicture} alt={user.username} className='w-20 h-15 object-cover ml-[-3rem]'/>
             
                </td>

                <td>
              
                 {user.username}
                
                </td>

                <td>
                 {user.email}
                </td>
                <td>
                 {user.isAdmin?(<FaCheck className='text-green-500'/>):(<FaTimes className='text-red-500'/>)}
                </td>

                <td>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' 
                    onClick={()=>{setShowModal(true);
                                  setUserIdToDelete(user._id)       
                    }}>Delete</span>
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
                <p>You have no users yet!</p>
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
                  This action cannot be undone. This will permanently delete your users and remove your data from our servers.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 w-full mt-8">
                <button
                  id="yes-btn"
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleDeleteUser}
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


export default DashUsers
