import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { getToken, useClerk, UserButton, useUser } from '@clerk/react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

    const {navigate, isEducator, backendUrl, setIsEducator, getToken} = useContext(AppContext)
    const location = useLocation()

    const isCourseListPage = location.pathname.includes('/course-list');
    const {openSignIn} = useClerk()
    const {user} = useUser()

    const becomeEducator = async ()=>{
      try {
        if(isEducator){
          navigate('/educator')
          return;
        }

        const token = await getToken()
        const { data } = await axios.get(backendUrl + '/api/educator/update-role', {headers: {Authorization: `Bearer ${token}`}})

        if(data.success){
          setIsEducator(true)
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500/20 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <img onClick={()=> navigate('/')} src={assets.logo} alt="Logo" className='w-36 sm:w-44 md:w-52 lg:w-60 cursor-pointer shrink-0' />

      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>

          { user && 
          <>
            <button onClick={becomeEducator} className='cursor-pointer hover:text-gray-700 transition'>{ isEducator ? 'Educator Dashboard' : 'Become Educator' }</button>
            <Link to ='/my-enrollments' className='hover:text-gray-700 transition'>My Enrollments</Link>
          </> 
          }
        </div>
        { user ? <UserButton/> : 
        <button onClick={()=> openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full cursor-pointer hover:bg-blue-700 transition'>Create Account</button> }
      </div>

      {/* for phone screens */}
      <div className='md:hidden flex items-center gap-2 sm:gap-4 text-gray-500'>
        <div className='flex items-center gap-2 max-sm:text-xs text-sm'>
          { user && 
          <>
            <button onClick={becomeEducator} className='cursor-pointer'>{ isEducator ? 'Educator' : 'Become Educator' }</button>
            <span className='text-gray-300'>|</span>
            <Link to ='/my-enrollments'>My Enrollments</Link>
          </> 
          }
        </div>
        {
          user ? <UserButton/> :
          <button onClick={()=> openSignIn()} className='p-1.5 cursor-pointer'> <img src={assets.user_icon} alt="user" className='w-5 h-5' /></button>
        }
      </div>
    </div>
  )
}

export default Navbar
