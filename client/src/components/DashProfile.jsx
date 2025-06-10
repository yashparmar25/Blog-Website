import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useRef } from 'react'
import {app} from '../redux/firebase'
import { Toaster, toast } from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { updateFailure,updateStart,updateSuccess,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { Alert, Modal } from 'flowbite-react'
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { Link } from 'react-router-dom'
const DashProfile = () => {
  const {currentUser}=useSelector(state=>state.user)
  const[imageFile,setImageFile]=useState(null)
  const[showSignUp,setShowSignUp]=useState(false)
  const[imageFileUrl,setImageFileUrl]=useState(null)
  const[imageFileUploadProgress,setImageFileUploadProgress]=useState(null)
  const[imageFileUploadError,setImageFileUploadError]=useState(null)
  const[imageFileUploading,setImageFileUploading]=useState(false)
  const[updateUserSuccess,setUpdateUserSuccess]=useState(false)
  const[showModal,setShowModal]=useState(false)
  const[updateUserError,setUpdateUserError]=useState(false)
  const[formData,setFormData]=useState({})
  const filePickerRef=useRef()
  const dispatch=useDispatch();
  
  useEffect(()=>{
  if(imageFile)
    {
      uploadImage();
    }
  },[imageFile])

  const uploadImage=()=>{
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2*1024*1024 && 
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    const storage=getStorage(app);
    const fileName =new Date().getTime() + imageFile.name;
    const storageRef=ref(storage,fileName)
    const uploadTask=uploadBytesResumable(storageRef,imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error)=>{
        setImageFileUploadError('Could not upload image (File must be less than 2MB)')
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setImageFileUrl(downloadURL);
          setFormData({...formData,profilePicture:downloadURL})
      })
    }
  )
}

  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(file)
      {
        setImageFile(e.target.files[0]);
        setImageFileUrl(URL.createObjectURL(file));
      } 
  }

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }

    const handleSignUp= async ()=>{
    try{
      const res=await fetch('/api/user/signout',{
        method:'POST',
      }
    )

    const data=await res.json();
    if(!res.ok)
      {
        console.log(data.message)
      }
      else{
       dispatch(signoutSuccess())
      }
    }

    catch(error)
    {
      console.log(error.message)
    }

  }

  const handleDeleteUser=async()=>{
    setShowModal(false)
    try{
     dispatch(deleteUserStart())
     const res=await fetch(`/api/user/delete/${currentUser._id}`,{
      method:'DELETE'
     })
     const data=await res.json();
     if(!res.ok)
      {
        dispatch(deleteUserFailure(data.message))
      }
      else{
        dispatch(deleteUserSuccess(data))
      }
    }
    catch(error)
    {
     dispatch(deleteUserFailure(error.message))
    }
  }

const handleSubmit= async(e)=>{
  e.preventDefault();//Restricting for refreshing the page
  if(Object.keys(formData).length===0)
  {
    setUpdateUserSuccess(toast.error('No Changes made', {
      position:'top-right'
     }))
   return;
  }
  if(imageFileUploading)
    {
      setUpdateUserError(toast.success('Please wait for image to upload!', {
        position:'top-right'
       }))
      return;
    }

  try{
     dispatch(updateStart());
     const res =await fetch(`/api/user/update/${currentUser._id}`,{
     method:'PUT',
     headers:{
      'Content-Type':'application/json',
     },
     body:JSON.stringify(formData)
     });
     const data=await res.json();
     if(!res.ok)
      {
        dispatch(updateFailure(data.message))
        toast.error('Invalid Data',{
          position:'top-right' 
        })
      }
      else{
        dispatch(updateSuccess(data))
        setUpdateUserSuccess( toast.success('Profile Updated Successfully!', {
          position:'top-right'
         }))
      }
  }

  catch(error)
  {
    dispatch(updateFailure(data.message)) 
  }
}

  return (
    <div className=' w-full ml-[2rem] h-[32rem]'>
    <h1 className='font-bold  text-2xl py-4 ml-[28.8rem] dark:text-yellow-50 '>Profile</h1>
    <form onSubmit={handleSubmit} className="flex flex-col">

      <input type="file" accept="/image/* " id="" onChange={handleImageChange} ref={filePickerRef} hidden/>
      <div className="relative w-32 h-32 ml-[27rem] cursor-pointer" onClick={()=>{filePickerRef.current.click()}}>
        
        {imageFileUploadProgress && (< CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} 
        strokeWidth={5}
        styles={{
          root:{
            width:'100%',
            height:'100%',
            position:'absolute',
            top:0,
            left:0,
          },
        path:{
        stroke:`rgba(62,152,199,${imageFileUploadProgress/100})`,
        }
        }
      }
        />)}

      <img src={imageFileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-4 dark:border-[lightgray] border-gray-400 ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`} />
      </div>
     
      <input type="text" id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} className='dark:bg-gray-800 ml-[20.5rem] rounded mt-[1rem] w-[21rem]' />
      
      <input type="email" id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} className='dark:bg-gray-800 ml-[20.5rem] rounded mt-[1rem] w-[21rem]' />
    
      <input type="password" id='password' placeholder='* * * * * * * *' defaultValue={currentUser.password} onChange={handleChange} className='dark:bg-gray-800 ml-[20.5rem] rounded mt-[1rem] w-[21rem] dark:placeholder:text-white'/>

{!currentUser.isAdmin&&(
      <button type='submit' className='dark:border-white w-[21rem] h-[2.5rem] border-red-300 bg-gradient-to-b from-red-400 to-orange-600  text-white rounded-lg mt-[1rem] ml-[20.5rem] '>Update</button>)}
       <Toaster></Toaster>
       <div className='flex'>

       <div>
       {
        currentUser.isAdmin && (
          <div>
          <button type='submit' className='dark:border-white w-[9rem] h-[2.5rem] border-red-300 bg-gradient-to-b from-red-400 to-orange-600  text-white rounded-lg mt-[1rem] ml-[20.5rem] '>Update</button>
          <Link to={'/create-post'}>
          <button className='w-[9rem] mt-[1rem] ml-[3rem] bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-2 px-4 rounded' >Create a post</button>
          </Link>
          </div>
        )
       }
       </div>
       </div>
       
    </form>

    <div className="text-red-500 dark:text-white flex gap-40 ml-[20.5rem] mt-5">
      <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
      <span className='cursor-pointer' onClick={()=>setShowSignUp(true)}>Sign Out</span>
    </div>

    {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                {/* Close Icon */}
                <span className="text-red-500 h-6 w-6 cursor-pointer" onClick={() => setShowModal(false)}>&times;</span>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Are you sure you want to delete your account?</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
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

{showSignUp && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                {/* Close Icon */}
                <span className="text-red-500 h-6 w-6 cursor-pointer" onClick={() => setShowSignUp(false)}>&times;</span>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Are you sure you want to Sign Out?</h3>
              <div className="mt-2 px-7 py-3">
                
              </div>
              <div className="flex items-center justify-between gap-4 w-full mt-8">
                <button
                  id="yes-btn"
                  className="px-8 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleSignUp}
                >
                  Yes
                </button>
                <Toaster></Toaster>
                <button
                  id="cancel-btn"
                  className="px-4 py-2 bg-white text-red-500 text-base font-medium rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => setShowSignUp(false)}
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

export default DashProfile
