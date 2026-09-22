import React, { act, useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import uniqid from 'uniqid'
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';



const AddCourse = () => {

  const { backendUrl, getToken, fetchAllCourses, currency } = useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterID] = useState(null);

  const [lectureDetails, setLectureDetails] =useState(
    {
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    }
  )

  const handleChapter =(action, chapterId) => {
    if(action === 'add'){
      const title = prompt('Enter Chapter Name:');
      if(title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length>0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    }else if (action === 'remove'){
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    }else if(action === 'toggle'){
      setChapters(
        chapters.map((chapter) => 
        chapter.chapterId === chapterId ? {...chapter, collapsed: !chapter.collapsed} : chapter)
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) =>{
    if(action === 'add'){
      setCurrentChapterID(chapterId);
      setShowPopup(true);
    }else if(action === 'remove'){
      setChapters(
        chapters.map((chapter) =>{
          if(chapter.chapterId === chapterId){
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  // function to add lecture
  const addLecture = () =>{
    setChapters(
      chapters.map((chapter)=>{
        if(chapter.chapterId === currentChapterId){
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length>0? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid()
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) =>{
    try {
      e.preventDefault()
      if(!image){
        toast.error('Thumbnail not Selected')
        return;
      }

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)

      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/educator/add-course', formData, {headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
        if (quillRef.current) {
          quillRef.current.root.innerHTML = ""
        }
        if (fetchAllCourses) {
          fetchAllCourses()
        }
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(()=>{
    if(!quillRef.current && editorRef.current){
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, [])

  return (
    <div className='min-h-screen flex flex-col items-start justify-start md:p-8 p-4 pt-6 pb-12 w-full text-left'>
      <form onSubmit={handleSubmit} action="" className='flex flex-col gap-5 max-w-2xl w-full text-gray-600'>

        <div className='flex flex-col gap-1.5'>
          <p className='font-medium text-gray-700 text-sm'>Course Title</p>
          <input onChange={e => setCourseTitle(e.target.value)} value={courseTitle} type="text" placeholder='Type here' className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 text-sm' required />
        </div>

        <div className='flex flex-col gap-1.5'>
          <p className='font-medium text-gray-700 text-sm'>Course Description</p>
          <div ref={editorRef} className='bg-white'></div>
        </div>

        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex flex-col gap-1.5'>
            <p className='font-medium text-gray-700 text-sm'>Course Price ({currency})</p>
            <input onChange={e => setCoursePrice(e.target.value)} value={coursePrice} placeholder='0' className='outline-none md:py-2.5 py-2 w-32 px-3 rounded border border-gray-300 text-sm' type="number" min={0} required/>
          </div>

          <div className='flex md:flex-row flex-col items-start md:items-center gap-3'>
            <p className='font-medium text-gray-700 text-sm'>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className='flex items-center gap-3 cursor-pointer'>
              <img src={assets.file_upload_icon} alt="" className='p-2.5 bg-blue-500 hover:bg-blue-600 transition rounded'/>
              <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept='image/*' hidden />

              {image && <img src={URL.createObjectURL(image)} alt="thumbnail preview" className='h-10 w-16 object-cover rounded'/>}
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <p className='font-medium text-gray-700 text-sm'>Discount %</p>
          <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder='0' min={0} max={100} className='outline-none md:py-2.5 py-2 w-32 px-3 rounded border border-gray-300 text-sm' required />
        </div>


        {/* Adding Chapters & Lectures */}
        <div className='space-y-3 pt-2'>
          <p className='font-medium text-gray-700 text-sm'>Course Chapters</p>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm'>
              <div className='flex justify-between items-center p-3.5 bg-gray-50 border-b border-gray-200'>
                <div className='flex items-center gap-2 min-w-0'>

                  <img onClick={()=> handleChapter('toggle', chapter.chapterId)} 
                  src={assets.dropdown_icon} width={14} alt="" className={`cursor-pointer transition-transform shrink-0 ${chapter.collapsed && "-rotate-90"}`} />
                  
                  <span className='font-semibold text-gray-800 text-sm truncate'>{chapterIndex + 1}. {chapter.chapterTitle}</span>
                </div>
                <div className='flex items-center gap-3 shrink-0'>
                  <span className='text-gray-500 text-xs'>{chapter.chapterContent.length} lectures</span>
                  <img src={assets.cross_icon} alt="remove" onClick={() =>handleChapter('remove',chapter.chapterId)} className='cursor-pointer w-3.5 h-3.5' />
                </div>

              </div>
              {!chapter.collapsed && (
                <div className='p-4 space-y-2'>
                   {chapter.chapterContent.map((lecture, lectureIndex)=>(
                    <div key={lectureIndex} className="flex flex-wrap sm:flex-nowrap justify-between items-center text-xs sm:text-sm bg-gray-50/70 p-2 rounded gap-2">
                      <span className='truncate'>{lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target='_blank' rel="noreferrer" className='text-blue-500 hover:underline'>Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}</span>
                      <img src={assets.cross_icon} alt="remove lecture" onClick={()=>handleLecture('remove', chapter.chapterId,lectureIndex)} className='cursor-pointer w-3 h-3 shrink-0 ml-auto sm:ml-0'/>
                    </div>
                   ))}
                   <button type='button' className='inline-flex text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded cursor-pointer transition' onClick={()=> handleLecture('add',chapter.chapterId)}>+ Add Lecture</button>
                </div>
              )}
            </div>
          ))}
          <div className='flex justify-center items-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2.5 px-4 rounded-lg cursor-pointer transition text-sm' onClick={()=> handleChapter('add')}>+ Add Chapter</div>

          {showPopup && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4'>
              
              <div className='bg-white text-gray-700 p-6 rounded-lg shadow-xl relative w-full max-w-md'>

                <h3 className='text-lg font-semibold mb-4 text-gray-800'>Add Lecture</h3>

                <div className='mb-3'>
                  <p className='text-xs font-medium text-gray-600'>Lecture Title</p>
                  <input 
                  type="text"
                  className='mt-1 block w-full border border-gray-300 rounded py-1.5 px-3 text-sm outline-none focus:border-blue-500'
                  value={lectureDetails.lectureTitle}
                  onChange={(e) => setLectureDetails({...lectureDetails,lectureTitle: e.target.value })} />
                </div>

                <div className='mb-3'>
                  <p className='text-xs font-medium text-gray-600'>Duration (minutes)</p>
                  <input 
                  type="number"
                  className='mt-1 block w-full border border-gray-300 rounded py-1.5 px-3 text-sm outline-none focus:border-blue-500'
                  value={lectureDetails.lectureDuration}
                  onChange={(e) => setLectureDetails({...lectureDetails,lectureDuration: e.target.value })} />
                </div>

                <div className='mb-3'>
                  <p className='text-xs font-medium text-gray-600'>Lecture URL</p>
                  <input 
                  type="text"
                  className='mt-1 block w-full border border-gray-300 rounded py-1.5 px-3 text-sm outline-none focus:border-blue-500'
                  value={lectureDetails.lectureUrl}
                  onChange={(e) => setLectureDetails({...lectureDetails,lectureUrl: e.target.value })} />
                </div>

                <div className='mb-4 flex items-center gap-2'>
                  <input 
                  type="checkbox"
                  id="previewFreeCheck"
                  className='scale-110 cursor-pointer'
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) => setLectureDetails({...lectureDetails, isPreviewFree: e.target.checked })} />
                  <label htmlFor="previewFreeCheck" className='text-xs font-medium text-gray-600 cursor-pointer'>Is Preview Free?</label>
                </div>

                <button type='button' className='w-full bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded font-medium text-sm cursor-pointer' onClick={addLecture}>Add</button>

                <img onClick={()=>setShowPopup(false)} src={assets.cross_icon} className='absolute top-4 right-4 w-4 cursor-pointer' alt="close" />
              </div>
            </div>
          )
          }
        </div>


        <button type='submit' className='bg-gray-900 hover:bg-gray-800 transition text-white w-max py-2.5 px-8 rounded font-medium text-sm cursor-pointer mt-2'>ADD COURSE</button>
      </form>
    </div>
  )
}

export default AddCourse
