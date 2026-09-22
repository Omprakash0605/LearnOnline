import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/react'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const educatorData = dummyEducatorData
  const { user } = useUser()

  return (
    <div className='flex items-center justify-between px-4 sm:px-8 border-b border-gray-500/20 py-3 bg-white'>
      <Link to='/'><img src={assets.logo} alt="Logo" className='w-36 sm:w-44 md:w-52 shrink-0' /></Link>

      <div className='flex items-center gap-3 sm:gap-5 text-gray-500 text-sm'>
        <p className='truncate max-w-[140px] sm:max-w-none'>Hi! {user ? user.fullName : 'Developers'}</p>
        {user ? <UserButton /> : <img className='w-8 h-8 rounded-full' src={assets.profile_img} alt="profile" />}
      </div>
    </div>
  )
}

export default Navbar
