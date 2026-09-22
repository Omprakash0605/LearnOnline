import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-4 sm:px-8 border-t border-gray-200 bg-white py-2' >
      <div className='flex items-center gap-4'>

        <img className='hidden md:block w-36' src={assets.logo} alt="logo" />
        <div className='hidden md:block h-7 w-px bg-gray-300'></div>
        <p className='py-2 md:py-4 text-center text-xs md:text-sm text-gray-500'>Copyright 2026 © LearnOnline. All Right Reversed.</p>

      </div>

      <div className='flex items-center gap-3 my-2 md:my-0'>
        <a href="#" className='hover:opacity-80 transition'>
          <img src={assets.facebook_icon} alt="facebook_icon" className='w-6 h-6' />
        </a>
        <a href="#" className='hover:opacity-80 transition'>
          <img src={assets.twitter_icon} alt="twitter_icon" className='w-6 h-6' />
        </a>
        <a href="#" className='hover:opacity-80 transition'>
          <img src={assets.instagram_icon} alt="instagram_icon" className='w-6 h-6' />
        </a>
        
      </div>
    </footer>
  )
}

export default Footer
