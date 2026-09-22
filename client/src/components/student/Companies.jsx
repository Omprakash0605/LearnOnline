import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-16 px-4 sm:px-8'>
      <p className='text-base text-gray-500'>Trusted by learners from</p>
      <div className='flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-16 md:mt-10 mt-6'>
        <img src={assets.microsoft_logo} alt="microsoft" className='w-16 sm:w-20 md:w-28' />
        <img src={assets.walmart_logo} alt="walmart" className='w-16 sm:w-20 md:w-28' />
        <img src={assets.accenture_logo} alt="accenture" className='w-16 sm:w-20 md:w-28' />
        <img src={assets.adobe_logo} alt="adobe" className='w-16 sm:w-20 md:w-28' />
        <img src={assets.paypal_logo} alt="paypal" className='w-16 sm:w-20 md:w-28' />
      </div>
    </div>
  )
}

export default Companies
