import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets, dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { toast } from 'react-toastify'
import axios from 'axios'

const Dashboard = () => {


  const {currency, backendUrl, isEducator, getToken} = useContext(AppContext)
  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () =>{
    try {
      const token = await getToken()
      const {data} = await axios.get(backendUrl+ '/api/educator/dashboard', {headers: {Authorization: `Bearer ${token}`  
      }})

      if(data.success){
        setDashboardData(data.dashboardData)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if(isEducator){
      fetchDashboardData()

    }
  }, [isEducator])

  return dashboardData ?(
    <div className='min-h-screen flex flex-col items-start justify-start gap-8 md:p-8 p-4 pt-6 text-left w-full'>

      <div className='space-y-6 w-full max-w-5xl'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          <div className='flex items-center gap-3 bg-white shadow-sm border border-blue-500/40 p-4 rounded-lg'>
            <img src={assets.patients_icon} alt="patients_icon" className='w-12 h-12' />
            <div>
              <p className='text-2xl font-semibold text-gray-700'>{dashboardData.enrolledStudentsData.length}</p>
              <p className='text-sm text-gray-500'>Total Enrollments</p>
            </div>
          </div>

          <div className='flex items-center gap-3 bg-white shadow-sm border border-blue-500/40 p-4 rounded-lg'>
            <img src={assets.appointments_icon} alt="appointment_icon" className='w-12 h-12' />
            <div>
              <p className='text-2xl font-semibold text-gray-700'>{dashboardData.totalCourses}</p>
              <p className='text-sm text-gray-500'>Total Courses</p>
            </div>
          </div>

          <div className='flex items-center gap-3 bg-white shadow-sm border border-blue-500/40 p-4 rounded-lg'>
            <img src={assets.earning_icon} alt="earning_icon" className='w-12 h-12' />
            <div>
              <p className='text-2xl font-semibold text-gray-700'>{currency}{dashboardData.totalEarnings}</p>
              <p className='text-sm text-gray-500'>Total Earnings</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className='pb-4 text-lg font-medium text-gray-800'>Latest Enrollments</h2>
          <div className='w-full overflow-x-auto rounded-lg bg-white border border-gray-500/20 shadow-sm'>

            <table className='table-fixed md:table-auto w-full'>
              <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell w-16'>#</th>
                  <th className='px-4 py-3 font-semibold'>Student Name</th>
                  <th className='px-4 py-3 font-semibold'>Course Title</th>
                </tr>
              </thead>
              <tbody className='text-sm text-gray-600'>
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className='border-b border-gray-500/10 hover:bg-gray-50/50 transition'>
                    <td className='px-4 py-3 text-center hidden sm:table-cell'>{index+1}</td>
                    <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                      <img src={item.student?.imageUrl || assets.profile_img} alt="Profile" className='w-8 h-8 rounded-full object-cover shrink-0'/>
                      <span className='truncate font-medium text-gray-800'>{item.student?.name || 'Student'}</span>
                    </td>
                    <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>

    </div>
  ) : <Loading />
}

export default Dashboard
