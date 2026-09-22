import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <div className='pb-14 px-4 sm:px-8 md:px-14 lg:px-36 text-center md:text-left w-full'>
      <h2 className='text-2xl sm:text-3xl font-medium text-gray-800'>Testimonials</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3 max-w-3xl'>Hear from our learners as they share their journeys of transformation, success, and how our <br className='hidden md:inline'/> platform has made a difference in their lives.</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10 md:mt-14'>
        {dummyTestimonial.map((testimonial, index)=>(
          <div key={index} className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between'>
            <div>
              <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
                <img className="h-12 w-12 rounded-full object-cover shrink-0" src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h3 className='text-base font-medium text-gray-800'>{testimonial.name}</h3>
                  <p className='text-xs text-gray-500'>{testimonial.role}</p>
                </div>
              </div>
              <div className='p-5 pb-4'>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_, i)=>(
                    <img key={i} src={i < Math.floor(testimonial.rating)?assets.star: assets.star_blank} alt="star" className='w-4 h-4' />
                  ))}
                </div>
                <p className='text-gray-500 mt-4 leading-relaxed'>{testimonial.feedback}</p>
              </div>
            </div>
            <a href="#" className='text-blue-500 underline px-5 text-sm'>Read more</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection
