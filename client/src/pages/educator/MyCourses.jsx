import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'


const MyCourses = () => {
  const {currency, backendUrl, isEducator, getToken} = useContext(AppContext)

  const [courses, setCourses] = useState(null)

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/courses', {headers: {Authorization: `Bearer ${token}`}})

      data.success && setCourses(data.courses)

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if(isEducator){
      fetchEducatorCourses()
    }
  }, [isEducator])


  return courses ? (
    <div className='min-h-screen flex flex-col items-start justify-start md:p-8 p-4 pt-6 pb-12 w-full text-left'>
      <div className='w-full max-w-5xl'>
        <h2 className='pb-4 text-lg font-medium text-gray-800'>My Courses</h2>

        <div className='w-full overflow-x-auto rounded-lg bg-white border border-gray-500/20 shadow-sm'>
          <table className='md:table-auto table-fixed w-full'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left bg-gray-50'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
                <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
                <th className='px-4 py-3 font-semibold truncate'>Students</th>
                <th className='px-4 py-3 font-semibold truncate'>Published On</th>
              </tr>
            </thead>
            <tbody className='text-sm text-gray-600'>
              {courses.map((course)=>(
                <tr key={course._id} className='border-b border-gray-500/10 hover:bg-gray-50/50 transition'>
                  <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                    <img src={course.courseThumbnail} alt="Course Image" className='w-16 h-10 rounded object-cover aspect-video shrink-0' />
                    <span className='truncate font-medium text-gray-800'>{course.courseTitle}</span>
                  </td>
                  <td className='px-4 py-3 font-medium text-gray-800'>{currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice /100))}</td>
                  <td className='px-4 py-3'>{course.enrolledStudents.length}</td>
                  <td className='px-4 py-3 text-gray-500'>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default MyCourses
