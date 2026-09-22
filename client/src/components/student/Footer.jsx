import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-900 px-4 sm:px-8 md:px-14 lg:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start justify-between gap-10 lg:gap-20 py-10 border-b border-white/20'>
        <div className='flex flex-col md:items-start items-center w-full md:max-w-xs text-center md:text-left'>
          <img src={assets.logo_dark} alt="logo" className='w-40 sm:w-48' />
          <p className='mt-6 text-sm text-white/80 leading-relaxed'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio molestias vel nesciunt ex earum atque cupiditate excepturi dolorum maxime dolores.</p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full md:w-auto text-center md:text-left'>
          <h2 className='font-semibold text-white mb-4 sm:mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-center gap-4 sm:gap-6 md:gap-2 text-sm text-white/80'>
            <li><a href="#" className='hover:text-white transition'>Home</a></li>
            <li><a href="#" className='hover:text-white transition'>About us</a></li>
            <li><a href="#" className='hover:text-white transition'>Contact us</a></li>
            <li><a href="#" className='hover:text-white transition'>Privacy Policy</a></li>
          </ul>
        </div>
        <div className='flex flex-col items-center md:items-start w-full md:max-w-sm text-white text-center md:text-left'>
          <h2 className='font-semibold mb-2'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80'>The latest news, article, and resources, sent to your inbox weekly.</p>
          <div className='flex flex-col sm:flex-row items-center gap-2 pt-4 w-full'>
            <input type="email" placeholder='Enter your email' className='border border-gray-500/30 bg-gray-800 text-white placeholder-gray-400 outline-none w-full sm:w-64 h-9 rounded px-3 text-sm'/>
            <button className='bg-blue-600 w-full sm:w-28 h-9 text-white rounded cursor-pointer hover:bg-blue-700 transition'>Subscribe</button>
          </div>
        </div>
      </div>
      <p className='py-4 text-center text-xs md:text-sm text-white/60'>Copyright 2026 © LearnOnline. All Right Reserved.</p>
    </footer>
  )
}

export default Footer
