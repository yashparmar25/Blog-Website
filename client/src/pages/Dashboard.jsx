import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSideBar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'
import DashBoardComp from '../components/DashBoardComp'

const Dashboard = () => {
  const location=useLocation()
  const [tab,setTab]=useState('profile')

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab')
    if(tabFromUrl)
      {
        setTab(tabFromUrl);
      }
    console.log(tabFromUrl);
  },[location.search])

  return (
    <div className='h-full flex'>

      <div className="">
      <DashSideBar></DashSideBar>
      </div>
       
      {tab==='profile' && <DashProfile/>} 
      {tab=='posts' && <DashPosts/>}
      {tab=='users' && <DashUsers/>}
      {/* {tab==='comments' && <DashComments/>} */}
      {tab==='dash'  && <DashBoardComp/>}
    </div>
  )
}

export default Dashboard
