import React, { useContext, useEffect, useState } from 'react'
import SearchBar from '../../components/student/SearchBar'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import CoursesCard from '../../components/student/CoursesCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

const CoursesList = () => {

  const {navigate, allCourses} = useContext(AppContext)
  const {input} = useParams()
  const [filteredCourse, setFilteredCourse] = useState([])

  useEffect(()=>{
    if(allCourses && allCourses.length>0){
      const tempCourses = allCourses.slice()
      input ? 
        setFilteredCourse(
          tempCourses.filter(
            item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
        )
      : setFilteredCourse(tempCourses)
    }
  },[allCourses,input])

  return (
    <>
    <div className='relative px-4 sm:px-8 md:px-14 lg:px-36 pt-12 md:pt-20 text-left min-h-[70vh]'>
      <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
        <div>
          <h1 className='text-3xl sm:text-4xl font-semibold text-gray-800'>Course List</h1>
          <p className='text-gray-500 text-sm mt-1'>
            <span className='text-blue-600 cursor-pointer hover:underline' onClick={()=> navigate('/')}>Home</span> / <span>Course List</span>
          </p>
        </div>
        <div className='w-full md:w-auto md:min-w-[360px] lg:min-w-[460px]'>
          <SearchBar data={input} />
        </div>
      </div>
      {
        input && <div className='inline-flex items-center gap-3 px-3 py-1.5 border border-gray-300 rounded mt-4 text-gray-600 text-sm bg-gray-50'>
          <p className='truncate max-w-xs'>{input}</p>
          <img src={assets.cross_icon} alt="clear" className='cursor-pointer w-3 h-3 shrink-0' onClick={()=>{ navigate('/course-list')}}/>
        </div>
      }
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 md:my-16 gap-6'>
        {filteredCourse.map((course,index)=> <CoursesCard key={index} course={course}/>)}
      </div>
    </div>
    <Footer />
    </>
    
  )
}

export default CoursesList
