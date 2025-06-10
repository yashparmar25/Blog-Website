import { current } from '@reduxjs/toolkit';
import React from 'react';
import { useSelector } from 'react-redux'
import { FaUserCircle, FaSignInAlt,FaCopy, FaUser } from 'react-icons/fa'; // Importing icons from react-icons
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { HiChartPie } from 'react-icons/hi';

const DashSidebar = () => {

  const location = useLocation(); // Get the current location
  const {currentUser}=useSelector(state=>state.user)
  // Function to determine if the path is the active one
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="sidebar dark:bg-gray-800 dark:text-white bg-slate-100 w-52 h-full space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      {/* Profile Section */}

      {
       currentUser && currentUser.isAdmin && (
        <Link to="/dashboard?tab=dash" className={`flex items-center space-x-2 px-4 ${isActive('/dashboard?tab=profile') ? 'bg-gray-700' : ''}`}>
        <HiChartPie />
       
        {
          currentUser.isAdmin &&
          (
            <span>DashBoard</span>
          )
        }
      </Link>
        
       )
      }
      <Link to="/dashboard?tab=profile" className={`flex items-center space-x-2 px-4 ${isActive('/dashboard?tab=profile') ? 'bg-gray-700' : ''}`}>
        <FaUserCircle />
        <span>Profile</span>
        {/* {
          currentUser.isAdmin &&
          (
            <span className=''>
              <div className='ml-[2rem] '>[Admin]</div></span>
          )
        } */}
      </Link>
      
 
      {currentUser.isAdmin &&
          (
            <Link to="/dashboard?tab=posts" className={`flex items-center space-x-2 px-4 ${isActive('/dashboard?tab=posts') ? 'bg-gray-700' : ''}`}>
            <FaCopy/>
            <span>Posts</span>
          </Link>
          )
      }

{currentUser.isAdmin &&
          (
            <Link to="/dashboard?tab=users" className={`flex items-center space-x-2 px-4 ${isActive('/dashboard?tab=posts') ? 'bg-gray-700' : ''}`}>
            <FaUser/>
            <span>Users</span>
          </Link>
          )
      }

      {/* Sign Up Section */}
      <Link to ='/sign-up' className={`flex items-center space-x-2 px-4 ${isActive('/profile') ? 'bg-gray-700' : ''}`}>
        <FaSignInAlt />
        <span>Sign Out</span>
      </Link>

    </div>
  );
};

export default DashSidebar;
