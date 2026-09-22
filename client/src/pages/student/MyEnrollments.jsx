import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Line } from 'rc-progress'
import Footer from '../../components/student/Footer'
import axios from 'axios'
import { data } from 'react-router-dom'
import { toast } from 'react-toastify'


const MyEnrollments = () => {

  const {enrolledCourses, calculateCourseDuration, navigate, userData, fetchUserEnrolledCourses, backendUrl, getToken, calculateNoOfLectures} = useContext(AppContext)

  const [progressArray, setProgressArray] = useState([])

  const getCourseProgress = async()=>{
    try{
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course)=>{
          const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`,{courseId: course._id}, {headers: {Authorization: `Bearer ${token}`}})

          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;

          return {totalLectures, lectureCompleted}
        })
      )
      setProgressArray(tempProgressArray);

    }catch(error){
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    if(userData){
      fetchUserEnrolledCourses()
    }
  }, [userData])

  useEffect(()=>{
    if(enrolledCourses.length>0){
      getCourseProgress()
    }
  }, [enrolledCourses])

  return (
    <>
    <div className='px-4 sm:px-8 md:px-14 lg:px-36 pt-10 min-h-[70vh] text-left'>
      <h1 className='text-2xl sm:text-3xl font-semibold text-gray-800'>My Enrollments</h1>
      <div className='overflow-x-auto w-full mt-8 rounded-lg border border-gray-500/20'>
        <table className='md:table-auto table-fixed w-full overflow-hidden'> 
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden bg-gray-50'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate text-right sm:text-left'>Status</th>
            </tr>
          </thead>

          <tbody className='text-gray-700'>
            {enrolledCourses.map((course,index)=>(
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                  <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28 rounded object-cover aspect-video shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='mb-1 max-sm:text-sm font-medium text-gray-800 truncate'>{course.courseTitle}</p>

                    <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted*100)/progressArray[index].totalLectures : 0} className='bg-gray-300 rounded-full' />

                  </div>
                </td>
                <td className='px-4 py-3 max-sm:hidden text-sm'>
                  {calculateCourseDuration(course)}
                </td>
                <td className='px-4 py-3 max-sm:hidden text-sm'>
                  {progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`} <span>Lectures</span>
                </td>
                <td className='px-4 py-3 text-right sm:text-left'>
                  <button className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 rounded text-xs sm:text-sm text-white cursor-pointer hover:bg-blue-700 transition' onClick={()=> navigate('/player/' + course._id)}>{progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 ? 'Completed' : 'On Going'}</button>
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>

    <Footer />
    </>
  )
}

export default MyEnrollments
