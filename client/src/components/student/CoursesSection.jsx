import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CoursesCard from './CoursesCard'

const CoursesSection = () => {

  const {allCourses} = useContext(AppContext)
  return (
    <div className='py-16 px-4 sm:px-8 md:px-14 lg:px-36 text-center md:text-left w-full'>
      <h2 className='text-2xl sm:text-3xl font-medium text-gray-800'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3 max-w-3xl'>Discover our top-rated courses across various categories. From coding and design to business <br className='hidden md:inline' />and wellness, our courses are crafted to deliver results.</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 md:my-14 gap-6'>
        {allCourses.slice(0,4).map((course, index)=> <CoursesCard key={index} course={course} />)}
      </div>

      <div className='flex justify-center md:justify-start'>
        <Link to={'/course-list'} onClick={()=> window.scrollTo(0,0)} className='text-gray-500 border border-gray-500/30 px-8 sm:px-10 py-3 rounded hover:bg-gray-50 transition'>Show all courses</Link>
      </div>
    </div>
  )
}

export default CoursesSection
