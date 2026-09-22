import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { data, useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'
import axios from 'axios'

const Player = () => {

  const {enrolledCourses, calculateChapterTime, backendUrl, getToken, userData, fetchUserEnrolledCourses} = useContext(AppContext)
  const {courseId} = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [initialRating, setInitialRating] = useState(0)

  const getCourseData = ()=>{
    enrolledCourses.map((course)=>{
      if(course._id == courseId){
        setCourseData(course)
        course.courseRatings.map((item)=>{
          if(userData && item.userId === userData._id){
            setInitialRating(item.rating)
          }
        })
      }
    })
  }

  const toggleSection =(index)=>{
    setOpenSections((prev)=>(
      {...prev,
        [index]: !prev[index],
      }
    ));
  }

  useEffect(()=>{
    if(enrolledCourses.length > 0){
      getCourseData()
    }
  }, [enrolledCourses])

  const markLectureAsCompleted = async(lectureId)=>{
    try {
      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/user/update-course-progress', {courseId, lectureId}, {headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        toast.success(data.message)
        getCourseProgress()
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  const getCourseProgress = async ()=>{
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/get-course-progress', {courseId}, {headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        setProgressData(data.progressData || data.progessData)
      }else{
        toast.error(data.message)
      }

    }catch(error){
      toast.error(data.message)
    }
  }

  const handleRate = async(rating)=>{
    try{
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/add-rating', {courseId, rating}, {headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        toast.success(data.message)
        fetchUserEnrolledCourses()
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    getCourseProgress()
  }, [])

  return courseData ? (
    <>
      <div className='px-4 sm:px-8 md:px-14 lg:px-36 py-8 md:py-12 flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-10 text-left min-h-[75vh]'>


        {/* left column */}
        <div className='text-gray-800 w-full'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>
          
          <div className='pt-5'>
            {courseData && courseData.courseContent.map((chapter, index)=> (
              <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none gap-2' onClick={()=> toggleSection(index)}>
                  <div className='flex items-center gap-2 min-w-0'>
                    {/* arrow to merge the course  */}
                    <img className={`transform transition-transform shrink-0 ${openSections[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrowicon" />

                    <p className='font-medium md:text-base text-sm truncate'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-xs md:text-sm text-gray-500 shrink-0'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                    {chapter.chapterContent.map((lecture, i)=>(
                      <li key={i} className='flex items-start gap-2 py-1.5'>
                        <img src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="playicon" className='w-4 h-4 mt-1 shrink-0'/>
                        <div className='flex flex-wrap sm:flex-nowrap items-center justify-between w-full text-gray-800 text-xs md:text-sm gap-2'>
                          <p className='truncate'>{lecture.lectureTitle}</p>
                          <div className='flex items-center gap-3 shrink-0 ml-auto sm:ml-0'>
                            {lecture.lectureUrl && <p onClick={()=> setPlayerData({...lecture, chapter: index+1, lecture: i+1})} className='text-blue-500 hover:underline cursor-pointer font-medium'>Watch</p>}
                            <p className='text-gray-500'>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {units: ['h','m']})}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            ))}
          </div>

          <div className='flex flex-wrap items-center gap-3 py-3 mt-8'>
            <h3 className='text-lg sm:text-xl font-bold'>Rate this Course:</h3>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>

        </div>

        {/* right column */}
        <div className='w-full'>
          {playerData ? (
            <div className='rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200 p-2'>
              <YouTube 
                videoId={(() => {
                  const url = playerData.lectureUrl;
                  const match = url ? url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/) : null;
                  return match ? match[1] : (url ? url.split('/').pop() : '');
                })()} 
                iframeClassName='w-full aspect-video rounded' 
              />

              <div className='flex flex-wrap justify-between items-center gap-2 mt-3 px-2 pb-1'>
                <p className='font-medium text-gray-800 text-sm md:text-base'>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>

                <button onClick={()=> markLectureAsCompleted(playerData.lectureId)} className='text-blue-600 hover:underline cursor-pointer font-medium text-sm'>{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? '✓ Completed' : 'Mark Completed'}</button>
              </div>
            </div>
          ) : (
            <div className='rounded-lg overflow-hidden shadow-sm border border-gray-200'>
              <img src={courseData ? courseData.courseThumbnail : ''} alt={courseData?.courseTitle} className='w-full aspect-video object-cover' />
            </div>
          )
          }
        </div>

      </div>

      <Footer />
    </>
  ) : <Loading />
}

export default Player
