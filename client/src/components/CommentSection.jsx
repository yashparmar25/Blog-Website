import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {toast,Toaster} from 'react-hot-toast'
import Comment from './Comment'
const CommentSection = ({postId}) => {
  const{currentUser}=useSelector(state=>state.user)
  const[comment,setComment] = useState('')
  const[commentError,setCommentError] = useState(null)
  const[comments,setComments] = useState([])
  console.log(comments)

  const handleSubmit  = async (e)=>{
  e.preventDefault()
  toast.success('Comment uploaded')
  if(comment.length>200)
    {
    return
    }

    const res = await fetch('/api/comment/create',{
    method:'POST',
    headers:{
        'Content-Type':'application/json',
    },
    body:JSON.stringify({content:comment,postId,userId:currentUser._id})
    })

    const data = await res.json();
    if(res.ok)
    {
    setComment('')
    setComments([data,...comments])
    }
}

useEffect(()=>{
    const getComments = async () =>{
        try{
            const res=await fetch(`/api/comment/getPostComments/${postId}`)
            if(res.ok)
            {
            const data = await res.json();
            setComments(data)
            }
        }
        catch(error)
        {
            console.log(error.message)
        }
    }
    getComments()

},[postId])

 const handleLike = async (commentId)=>{
  try{
    if(!currentUser)
      {
        navigate('/sign-in');
        return
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`,
      {
          method:'PUT',
      }
      );
      if(res.ok)
      {
      const data = await res.json()
      setComments(comments.map((comment)=>
      {
        comment._id === commentId ? {
        ...comment,
        likes:data.likes,
        numberOfLikes:data.likes.length,
        }:comment
      }))
      } 
  }
  catch(error)
  {
    console.log(error.message)
  }

 }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? 
      (
        <div className="flex items-center gap-1 my-5 text-gray-400 text-sm ml-[-4.5rem]">
            <p>Signed in as:</p>
            <img src={currentUser.profilePicture} alt="" className='h-5 w-5 object-cover rounded-full'/>
            <Link to={'/dashboard?tab=profile'} className='text-cyan-600 hover:underline'>
            @{currentUser.username}</Link>
        </div>
      ):
      (
        <div className="text-sm">
            You must be signed in to comment.
            <Link to={'/sign-in'}>Sign In</Link>
        </div>
      )}

      {currentUser && (
        <form className=' border border-teal-400 rounded-md rounded-tr-3xl rounded-bl-3xl p-3 ml-[-4.5rem] w-[50rem]' onSubmit={handleSubmit}>
            <input type="text" placeholder='Add a comment...' maxLength='200' className='h-[4rem] rounded-md w-[20rem]  dark:bg-gray-700 dark:placeholder:text-white' onChange={(e)=>setComment(e.target.value)} value={comment}/>
            <div className=" flex justify-between items-center">
                <div className="flex gap-11">
                    <p className='mt-[1rem] text-xs'>{200-comment.length} characters remaining</p>
                    <button type='submit' className='font-bold mt-[0.75rem] ml-[3rem] bg-green-500 text-white text-lg h-[2rem] w-[6rem] rounded-tl-3xl rounded-br-3xl rounded-bl-none shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>Submit</button>
                    <Toaster></Toaster>
                </div>
            </div>
        </form>
      )}

      {
        comments.length === 0 ? (
        <p className='text-sm my-5'>No Comments yet!</p>)
        :
        (
          <>
          <div className="text-sm my-5 ml-[-4rem] flex items-center gap-1">
            <p>Comments</p>
            <div className = "border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map(comment=>(
            <Comment key={comment._id} comment={comment} onClick={handleLike}/>
          ))}
          
          </>
          
        )
      }
    </div>
  )
}

export default CommentSection
