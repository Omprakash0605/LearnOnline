import { clerkClient } from '@clerk/express'
import Course from '../models/Course'

//update role to educator 
export const updateRoleToEducator =async (req, res)=>{
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publishMetadata: {
                role: 'educator',
            }
        })

        res.json({success: true, message: 'You can publish a course now'})

    }catch(error){

        res.json({success:false , message:error.message})
    
    }
}

export const addCourse= aysnc(req, res) =>{
    try {
        const {courseData} = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

        if(!imageFile){
            return res.json({sucess: false, message:'Thumbnail not attached'})
        }

        const parsedCourseData = await JSON.parge(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json( {sucess: true, message: 'Course Added'})
    }

}