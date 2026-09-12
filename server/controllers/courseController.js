import Course from "../models/Course.js"

//get all Courses
export const getAllCourses = async (req, res)=>{
    try{
        const courses = await Course.find({isPublished: true}).select(['-courseContent', '-enrolledStudents']).populate({path: 'educator'})
        res.json({success:true, courses})
    }catch(error){
        res.json({success:false, message: error.message})
    }
}

//get course by id
export const getCourseId = async(req,res)=>{
    const { id } = req.params
    try {
        const courseData = await Course.findById(id).populate({path: 'educator'})

        if(!courseData){
            return res.json({success: false, message: 'Course not found'})
        }

        //remove lectureURL if isPreviewFree is False 
        if(Array.isArray(courseData.courseContent)){
            courseData.courseContent.forEach(chapter => {
                if(Array.isArray(chapter.chapterContent)){
                    chapter.chapterContent.forEach(lecture => {
                        if(!lecture.isPreviewFree){
                            lecture.lectureUrl = "";
                        }
                    })
                }
            })
        }

        res.json({success:true, courseData})

    }catch(error){
        res.json({success:false, message: error.message})
    }
}
