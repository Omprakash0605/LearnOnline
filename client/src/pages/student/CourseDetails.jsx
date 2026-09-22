import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import YouTube from 'react-youtube'
import { toast } from 'react-toastify'
import axios from 'axios'

const CourseDetails = () => {
  const {id} = useParams()
  
  const [courseData, setCourseData] = useState(null)

  const [openSections, setOpenSections] = useState({})

  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)

  const [playerData, setPlayerData] = useState(null)


  const {allCourses, calculateRating, calculateChapterTime, calculateCourseDuration, calculateNoOflectures, currency, backendUrl, userData, fetchUserData, fetchUserEnrolledCourses, getToken, navigate} = useContext(AppContext)

  const fetchCourseData = async()=>{
    try {
      const {data} = await axios.get(backendUrl + '/api/course/' + id)

      if(data.success){
        setCourseData(data.courseData)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // enroll course (dummy payment)
  const enrollCourse = async()=>{
    try {
      if(!userData){
        return toast.warn('Please login to enroll')
      }
      if(isAlreadyEnrolled){
        navigate('/player/' + courseData._id)
        return
      }
      const token = await getToken();

      const {data} = await axios.post(
        backendUrl + '/api/user/purchase',
        {courseId: courseData._id},
        {headers: {Authorization: `Bearer ${token}`}}
      )

      if(data.success){
        toast.success(data.message || 'Enrolled successfully!')
        setIsAlreadyEnrolled(true)
        if (fetchUserData) await fetchUserData()
        if (fetchUserEnrolledCourses) await fetchUserEnrolledCourses()
        navigate('/my-enrollments')
      }else{
        toast.error(data.message)
      }

    } catch (error){
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchCourseData()
  },[])

  useEffect(()=>{
    if(userData && courseData){
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  },[userData, courseData])

  const toggleSection =(index)=>{
    setOpenSections((prev)=>(
      {...prev,
        [index]: !prev[index],
      }
    ));
  }

  return courseData ? (
    <>
    <div className='flex md:flex-row flex-col-reverse gap-10 relative z-0 items-start justify-between px-4 sm:px-8 md:px-14 lg:px-36 md:pt-28 pt-12 text-left'>

      <div className='absolute top-0 left-0 w-full h-section-height -z-10 bg-gradient-to-b from-cyan-100/70 to-white'></div>

      {/* {left column} */}
      <div className='w-full max-w-xl z-10 text-gray-500'>
        <h1 className='text-course-details-heading-small md:text-course-details-heading-large font-semibold text-gray-800'>{courseData.courseTitle}</h1>
        <p className='pt-4 md:text-base text-sm leading-relaxed' dangerouslySetInnerHTML={{__html: courseData.courseDescription.slice(0,200)}}></p>


      {/* {review and ratings } */}
      <div className='flex flex-wrap items-center gap-2 pt-3 pb-1 text-sm'>
        <p className='font-medium text-gray-800'>{calculateRating(courseData)}</p>
        <div className='flex'>
          {[...Array(5)].map((_,i)=>(<img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5'/>))}
        </div>

        <p className='text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length>1 ? 'ratings' : 'rating'})</p>

        <p className='text-gray-500'>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length>1 ? 'students':'student'}</p>
      </div>

      <p className='text-sm'>Course by <span className='text-blue-600 font-medium'>{courseData.educator?.name || 'Educator'}</span></p>

      <div className='pt-8 text-gray-800'>
        <h2 className='text-xl font-semibold'>Course Structure</h2>

        <div className='pt-5'>
          {courseData.courseContent.map((chapter, index)=> (
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
                      <img src={assets.play_icon} alt="playicon" className='w-4 h-4 mt-0.5 shrink-0'/>
                      <div className='flex flex-wrap sm:flex-nowrap items-center justify-between w-full text-gray-800 text-xs md:text-sm gap-2'>
                        <p className='truncate'>{lecture.lectureTitle}</p>
                        <div className='flex items-center gap-3 shrink-0 ml-auto sm:ml-0'>
                          {lecture.isPreviewFree && <p onClick={()=>{
                            const url = lecture.lectureUrl;
                            const match = url ? url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/) : null;
                            const videoId = match ? match[1] : (url ? url.split('/').pop() : '');
                            setPlayerData({ videoId })
                          }} className='text-blue-500 hover:underline cursor-pointer font-medium'>Preview</p>}
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
      </div>

      {/* course description */}
      <div className='py-12 md:py-20 text-sm md:text-base'>
          <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
          <p className='pt-3 rich-text leading-relaxed' dangerouslySetInnerHTML={{__html: courseData.courseDescription}}></p>
      </div>

      </div>


      {/* {right column} */}
      <div className='w-full md:max-w-sm lg:max-w-course-card z-10 shadow-custom-card rounded-lg overflow-hidden bg-white'>

        {
          playerData ?
                <YouTube videoId={playerData.videoId} opts={{playerVars: {autoplay: 1}}} iframeClassName='w-full aspect-video' /> :
                <img src={courseData.courseThumbnail} alt={courseData.courseTitle} className='w-full aspect-video object-cover' />
        }
        <div className='p-5'>
          <div className='flex items-center gap-2'>
              
            <img src={assets.time_left_clock_icon} alt="time left clock icon" />

            <p className='text-red-500 text-sm'><span className='font-medium'>5 days</span> left at this price!</p>

          </div>

          <div className='flex flex-wrap gap-3 items-center pt-2'>
            <p className='text-gray-800 md:text-3xl text-2xl font-semibold'>{currency}{(courseData.coursePrice -courseData.discount * courseData.coursePrice/100).toFixed(2)}</p>
            <p className='md:text-base text-sm text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
            <p className='md:text-base text-sm text-gray-500 font-medium'>{courseData.discount}% off</p>
          </div>

          <div className='flex flex-wrap items-center text-xs md:text-sm gap-3 sm:gap-4 pt-2 md:pt-4 text-gray-500'>

            <div className='flex items-center gap-1'>
              <img src={assets.star} alt="staricon" className='w-3.5 h-3.5' />
              <p>{calculateRating(courseData)}</p>
            </div>

            <div className='h-4 w-px bg-gray-500/40'></div>

            <div className='flex items-center gap-1'>
              <img src={assets.time_clock_icon} alt="clock icon" className='w-3.5 h-3.5' />
              <p>{calculateCourseDuration(courseData)}</p>
            </div>

            <div className='h-4 w-px bg-gray-500/40'></div>


            <div className='flex items-center gap-1'>
              <img src={assets.lesson_icon} alt="lesson_icon" className='w-3.5 h-3.5' />
              <p>{calculateNoOflectures(courseData)} lessons</p>
            </div>

          </div>

          <button 
            onClick={() => {
              if (isAlreadyEnrolled) {
                navigate('/player/' + courseData._id)
              } else {
                enrollCourse()
              }
            }} 
            className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium cursor-pointer hover:bg-blue-700 transition'
          >
            {isAlreadyEnrolled ? 'Already Enrolled (Go to Course)' : 'Enroll Now'}
          </button>

          <div className='pt-6'>
            <p className='md:text-lg text-base font-medium text-gray-800'>What's in the course?</p>
            <ul className='ml-4 pt-2 text-xs md:text-sm list-disc text-gray-500 space-y-1'>
              <li>Lifetime access with free updates.</li>
              <li>Step-by-step, hands-on project guidance.</li>
              <li>Downloadable resources and source code.</li>
              <li>Quizzes to test your knowledge.</li>
              <li>Certificate of completion.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>

    <Footer />
    </>
  ) : <Loading />
}

export default CourseDetails
