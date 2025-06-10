import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import { getDownloadURL, getStorage, uploadBytesResumable,ref } from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { app } from '../redux/firebase'
import { Toaster, toast } from "react-hot-toast";
import { useNavigate,useParams } from 'react-router-dom'
import { current } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


const UpdatePost = () => {
const[file,setFile]=useState(null)
const[imageUploadProgress,setImageUploadProgress]=useState(null)
const[imageUploadError,setImageUploadError]=useState(false)
const[formData,setFormData]=useState({})
const[publishError,setPublishError]=useState(null)
const{postId}=useParams();

const navigate=useNavigate()
const {currentUser}=useSelector((state)=>state.user)

const toasting = ()=>{
    toast.success('Post updated successfully')
}

useEffect(()=>{
    try{
     const fetchPost = async()=>{
     const res = await fetch(`/api/post/getposts?postId=${postId}`)
     const data=await res.json();
     if(!res.ok)
     {
      console.log(data.message)
      setPublishError(data.message)
      return;
     }
     if(res.ok)
        {
        setPublishError(null)
        setFormData(data.posts[0])
        }
    }
    fetchPost()
    }
    catch(error)
    {
    console.log(error.message)
    }

},[postId])

const handleUploadImage = () => {
try{
    
        if(!file)
    {
        setImageUploadError('Please select an image')
        return;
    } 
    
    setImageUploadError(null) 
    const storage=getStorage(app);
    const fileName=new Date().getTime() + '-' + file.name;
    const storageRef=ref(storage,fileName)
    const uploadTask=uploadBytesResumable(storageRef,file); 
    uploadTask.on(
        'state_changed',
        (snapshot)=>{
            const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
            setImageUploadProgress(progress.toFixed(0))
        },
        
        (error)=>{
            setImageUploadError('Image upload failed')
            setImageUploadProgress(null)
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                setImageUploadProgress(null)
                setImageUploadError(null)
                setFormData({...formData,image:downloadURL});
            })
        } 
    )
    setImageUploadError(true);

    setTimeout(() => {
        setImageUploadError(false);
      }, 5000);
}
    
    catch(error)
    {
    setImageUploadError('Image upload failed')
    setImageUploadProgress(null)
    console.log(error)
    }
}

const handleSubmit = async(e)=>{
e.preventDefault();

try{
    const res=await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(formData),
        }
    )
    const data=await res.json();
    if(!res.ok)
        {
            setPublishError(data.message)
            return
        }
    if(res.ok)
    {
     setPublishError(null)  
     navigate(`/post/${data.slug}`)         
    }
        
   }
   catch(error)
   {
    setPublishError('Something went wrong')
   }
   

}

    return (
    <div className='mx-auto h-full p-3'>
    <h1 className='text-center text-3xl font-semibold my-7'>Edit Post</h1>
    <form onSubmit={handleSubmit}>
        <div className='flex flex-row gap-5 ml-[15rem] mt-[4rem]'>
        <input type="text" placeholder='Title' id='title' className='w-[35rem] dark:bg-gray-800 dark:placeholder:text-white rounded-md' 
        onChange={(e)=>{
        setFormData({...formData,title:e.target.value})

        }}
        value={formData.title}/>
        <select name="" id="" className='dark:bg-gray-800 dark:placeholder:text-white rounded-md' onChange={(e)=>{
            setFormData({...formData,category:e.target.value})
        }}
        value={formData.category}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">ReactJS</option>
            <option value="nextjs">NextJS</option>
        </select>
        </div>
        <div className="flex flex-row gap-10 mt-[1rem] ml-[15.1rem] border-1 outline-dashed w-[47rem] h-[4rem] dark:bg-gray-800">
                <div className='mt-[0.75rem] ml-[0.5rem]'>
                <input type="file" accept='image/*' onChange={(e)=>{
                    setFile(e.target.files[0])
                }}/>
                <button type='submit' className='ml-[19rem] h-[2.5rem] w-[8rem] bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500' onClick={handleUploadImage} disabled={imageUploadProgress} >
                    {
                        imageUploadProgress ?(
                         
                        <div className="w-14 h-14 border border-blue-500 mt-[-0.5rem] ml-[3rem]">
                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}`}/>
                        </div>):'Upload Image'
                    }
                </button>          
                </div>
        </div>
        {
        imageUploadError &&( <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p className="text-red-500">Please Wait!</p>
            </div>
          </div>)
        }
        
        {
            formData.image && (
                <img src={formData.image} alt='upload' className='w-[15rem] h-[15rem] mt-[1rem] mx-auto'/>
            )
        }
        <ReactQuill theme='snow' value={formData.content} placeholder='Write Something....' className='h-72 mt-8 mx-auto w-[47.15rem] dark:bg-gray-800 dark:text-white dark:placeholder:text-white' required
         onChange={(value)=>{
         setFormData({...formData,content:value})   

        }}></ReactQuill>
        
        <button  className='ml-[15rem] mt-[4rem] h-[2.5rem] w-[8rem] bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' onClick={toasting}>Update</button>
        <Toaster></Toaster>
    </form>
    </div>
  )
}

export default UpdatePost
