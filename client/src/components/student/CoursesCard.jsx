import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CoursesCard = ({course}) => {

  const {currency, calculateRating} = useContext(AppContext)

  return (
    <Link to={'/course/' + course._id} onClick={()=> window.scrollTo(0,0)} className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg bg-white hover:shadow-md transition-shadow flex flex-col justify-between'>
      <div>
        <img className='w-full aspect-video object-cover' src={course.courseThumbnail} alt={course.courseTitle} />
        <div className='p-3 text-left'>
          <h3 className='text-base font-semibold text-gray-800 line-clamp-2'>{course.courseTitle}</h3>
          <p className='text-gray-500 text-sm mt-1'>{course.educator?.name || 'Educator'}</p>
          <div className='flex items-center space-x-2 my-1 text-sm'>
            <p className='font-medium'>{calculateRating(course)}</p>
            <div className='flex'>
              {[...Array(5)].map((_,i)=>(<img key={i} src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5'/>))}
            </div>
            <p className='text-gray-500 text-xs'>({course.courseRatings?.length || 0})</p>
          </div>
          <p className='text-base font-semibold text-gray-800 mt-1'>{currency}{(course.coursePrice - course.discount * course.coursePrice/100).toFixed(2)}</p>
        </div>
      </div>
    </Link>
  )
}

export default CoursesCard
