import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

/*home page search bar*/
const SearchBar = ({data}) => {

  const navigate = useNavigate()
  const [input, setInput] =useState(data ? data : '')

  const onSearchHandler = (e)=>{
    e.preventDefault()
    navigate('/course-list/' + input)
  }


  return (
    <form onSubmit={onSearchHandler} action="" className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded shadow-sm'>
      <img src={assets.search_icon} alt="search_icon" className='md:w-auto w-10 px-3 shrink-0' />

      <input onChange={e => setInput(e.target.value)} value={input}
      type="text" placeholder='Search for courses' className='w-full flex-1 min-w-0 h-full outline-none text-gray-500/80 text-sm md:text-base' />
      <button type='submit' className='bg-blue-600 rounded text-white md:px-10 px-5 md:py-3 py-2 mx-1 shrink-0 cursor-pointer hover:bg-blue-700 transition'>Search</button>
    </form>
  )
}

export default SearchBar
