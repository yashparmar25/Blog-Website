import { Avatar, Button, Dropdown, Navbar,TextInput} from 'flowbite-react'
import{Link} from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai' 
import { useDispatch,useSelector } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'


import {FaMoon,FaSun} from 'react-icons/fa'
import React from 'react'
const Header = () => {
  const dispatch=useDispatch()
  const {currentUser}=useSelector(state=>state.user)
  const {theme}=useSelector((state)=>state.theme);
  return (
    <div className='shadow-md'>
        <Navbar className='border-b-1 flex pb-6 dark:bg-gray-900 sticky z-10'>
        <Link to="/" className='self-centre whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white mt-4'>
        <span className='px-2 py-1  dark:text-white text-2xl mt-[-0.5rem]'>Blogify</span>
        </Link>

        <form className=' pt-[1rem]  ml-[3rem]  rounded-lg '>
            <input type='text' placeholder='Search..' className='mt-1 mr-[5rem] w-[9rem] rounded-md dark:placeholder:text-white dark:text-white dark:bg-gray-800' /> 
        </form>
      
        <div className='flex flex-row gap-[6rem] mt-[1rem] ml-[6rem] text-blue-800 '>
        <Link to='/'>
          <div className='hover:text-blue-600 hover:text-[1.1rem] hover:duration-200 dark:text-white text-'>
          Home
          </div>
          </Link>

          <Link to='/about'>
          <div className='hover:text-blue-600 hover:text-[1.1rem] hover:duration-200 dark:text-white text-lg'>
          About
          </div>
          </Link>
      
          <Link to='/projects'>
          <div className='hover:text-blue-600 hover:text-[1.1rem] hover:duration-200 dark:text-white text-lg'>
          Projects
          </div>
          </Link>
          </div>

          <button className='w-12 h-10 flex justify-center-20 pt-2 rounded-full ml-[16rem] shadow-2lg mt-2.5 dark:bg-gray-800 dark:border-black' color='gray' onClick={()=>dispatch(toggleTheme())}>
                {theme==='light' ? <FaSun className='mt-[0.25rem] ml-[1rem] '/> : <FaMoon className='mt-[0.25rem] ml-[0.75rem]'/>}
            </button>

            {currentUser ? (
             <Dropdown arrowIcon={false} className='z-20' inline label={<Avatar alt='user' img={currentUser.profilePicture} rounded className='ml-[1rem] mt-[0.6rem]'></Avatar>}>

              <Dropdown.Header>
                <span className='block text-sm'>{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>@{currentUser.email}</span>
              </Dropdown.Header>
              
               <hr />
              <Link to={'/dashboard?tab=profile'}>
              <div className='dark:hover:bg-gray-500 hover:bg-gray-200'><span className='dark:text-white  ml-[1rem]'>Profile</span></div></Link>
             
              <Link to='/sign-in'>
              <div className='dark:hover:bg-gray-500 hover:bg-gray-200'>
              <span className='dark:text-white ml-[1rem]'>Sign Out</span></div></Link>
              
             </Dropdown>
            )
            :(
            <Link to='/sign-in'>
            <button className='mt-[0.75rem] size-10 w-16 ml-[5rem]  dark:bg-gray-700 rounded-lg text-white shadow-lg dark:border-black'>
              <div className='ml-[0.1rem] mt-[0rem] font-extrabold text-blue-600 dark:text-white '>Sign In</div></button>
           </Link>
            )}

        </Navbar>
    </div>
  )
}

export default Header
