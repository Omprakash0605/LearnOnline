import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'


const Sidebar = () => {

    const { isEducator } = useContext(AppContext)

    const menuItems = [
        { name: 'Dashboard', path: '/educator', icon: assets.home_icon},
        { name: 'Add course', path: '/educator/add-course', icon : assets.add_icon},
        { name: 'My Courses', path: '/educator/my-courses', icon : assets.my_course_icon},
        { name: 'Student Enrolled', path: '/educator/student-enrolled', icon : assets.person_tick_icon},
    ];

  return isEducator && (
    <div className='w-16 md:w-64 border-r border-gray-200 shrink-0 min-h-[calc(100vh-70px)] bg-white py-2'>
      {menuItems.map((item)=>(
        <NavLink 
        to={item.path}
        key={item.name}
        end={item.path === '/educator'}
        className={({isActive})=> `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-8 gap-3 transition-colors ${isActive ? 'bg-indigo-50 border-r-[4px] md:border-r-[6px] border-indigo-500 font-medium text-indigo-600' : 'hover:bg-gray-50 text-gray-600 border-r-[4px] md:border-r-[6px] border-transparent'}`} >
          <img src={item.icon} alt="" className='w-5 h-5 shrink-0' />
          <p className='md:block hidden text-sm truncate'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
