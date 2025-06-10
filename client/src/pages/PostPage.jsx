import { Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

const PostPage = () => {
  const {postSlug}=useParams()
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState(false)
  const[post,setPost]=useState(null)
  const [recentPosts,setRecentPosts] = useState(null)

  useEffect(()=>{
  const fetchPost = async()=>
    {
        try{
        setLoading(true)
        const res=await fetch(`/api/post/getposts?slug=${postSlug}`)
        const data=await res.json()
        if(!res.ok)
          {
            setError(true)
            setLoading(false)
            return
          }
          if(res.ok)
          {
           setPost(data.posts[0])
           setLoading(false)
           setError(false)
          }
        }
        catch(error)
        {
         setError(true)
         setLoading(false)
        }
    };
    fetchPost()
  },[postSlug])

  useEffect(()=>{
  
    try{
    const fetchRecentPosts = async () =>
      {
       const res= await fetch(`/api/post/getposts?limit=5`)
       const data = await res.json()
       if(res.ok)
        {
          setRecentPosts(data.posts)
        }
      }
      fetchRecentPosts()
    }
    catch(error)
    {
      console.log(error.message)
    }
  },[postSlug])

  if (loading)
  return 
  (
    <div className="flex justify-center items-center min">
      <Spinner size='xl'></Spinner>
    </div>
  )



  return <main className="p-3 flex flex-col h-full mx-auto">
    <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>

    <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
    <button  class="bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white font-bold py-2 px-4 rounded shadow-md">{post && post.category}</button>
    </Link>

    <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 h-[20rem] w-[30rem] object-contain mx-auto'/>
    
    <div className="flex  p-3 border-b border-slate-500 mx-auto w-full text-xs">
      <span className='ml-[27rem] text-xl'>{post && new Date(post.createdAt).toLocaleDateString()}</span>
      <span className='ml-[12rem] text-sm mt-[0.1rem]'>{post && (post.content.length/10) } mins read</span>
    </div>

    <div className='p-3  mx-auto post-content' dangerouslySetInnerHTML={{__html:post && post.content}}></div>
    <div className="">
      <CallToAction/>
    </div>

    <CommentSection postId={post._id}></CommentSection>

    <div className="flex flex-col justify-center items-center mb-5">
      <h1 className='text-xl mt-5'>Recent Articles</h1>
      
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {
          recentPosts && recentPosts.map((post)=>(
            <PostCard key={post._id} post={post}/>
          ))
        }

      </div>
    </div>
  </main>

}

export default PostPage
