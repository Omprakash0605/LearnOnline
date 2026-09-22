import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-4 sm:px-8 md:px-14 lg:px-36 text-center'>
      <h2 className='text-2xl sm:text-3xl md:text-4xl text-gray-800 font-semibold'>Learn anything, anytime, anywhere</h2>
      <p className='text-gray-500 text-sm md:text-base max-w-2xl'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum debitis, est voluptatem<br className='hidden md:inline'/> dicta perspiciatis doloremque veniam! Aut ea qui deserunt eveniet iste, eius rerum quod autem consectetur quam alias ut.</p>
      <div className='flex flex-wrap items-center justify-center font-medium gap-4 sm:gap-6 mt-4'>
        <button className='px-8 sm:px-10 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer'>Get started</button>
        <button className='flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-600 transition'>Learn more <img src={assets.arrow_icon} alt='arrow_icon' /></button>
      </div>
    </div>
  )
}

export default CallToAction
