import React, { useContext, useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const StudentsEnrolled = () => {

  const {backendUrl, getToken, isEducator} = useContext(AppContext)

  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async() => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', {headers: {Authorization: `Bearer ${token}`}})
      if(data.success){
        setEnrolledStudents(data.enrolledStudents.reverse())
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() =>{
    if(isEducator){
      fetchEnrolledStudents()
    }
  }, [isEducator])


  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col items-start justify-start md:p-8 p-4 pt-6 pb-12 w-full text-left'>
      <div className='w-full max-w-5xl'>
        <h2 className='pb-4 text-lg font-medium text-gray-800'>Students Enrolled</h2>
        <div className='w-full overflow-x-auto rounded-lg bg-white border border-gray-500/20 shadow-sm'>
          <table className='table-fixed md:table-auto w-full'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left bg-gray-50'>
              <tr>
                <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell w-16'>#</th>
                <th className='px-4 py-3 font-semibold'>Student Name</th>
                <th className='px-4 py-3 font-semibold'>Course Title</th>
                <th className='px-4 py-3 font-semibold hidden sm:table-cell'>Date</th>
              </tr>
            </thead>
            <tbody className='text-sm text-gray-600'>
              {enrolledStudents.map((item, index) => (
                <tr key={index} className='border-b border-gray-500/10 hover:bg-gray-50/50 transition'>
                  <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>

                  <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                    <img src={item.student?.imageUrl || dummyStudentEnrolled[0]?.student?.imageUrl} alt="" className='w-8 h-8 rounded-full object-cover shrink-0' />
                    <span className='truncate font-medium text-gray-800'>{item.student?.name || 'Student'}</span>
                  </td>
                  
                  <td className='px-4 py-3 truncate'>{item.courseTitle}</td>

                  <td className='px-4 py-3 hidden sm:table-cell text-gray-500'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default StudentsEnrolled
