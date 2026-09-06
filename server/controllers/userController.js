import { CourseProgress } from "../models/CourseProgress.js";
import User from "../models/User.js"
import { getAuth } from "@clerk/express"

//get user data
export const getUserData = async(req, res)=>{
    try {
        const { userId } = getAuth(req);
        const user = await User.findById(userId);

        if(!user){
            return res.json({success: false, message: 'User Not Found'})
        }

        res.json({success:true, user})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

//users enrolled courses with lecturelinks
export const userEnrolledCourses = async (req, res)=>{
    try{
        const { userId } = getAuth(req);
        const userData = await User.findById(userId).populate('enrolledCourses');

        if (!userData) {
            return res.json({
                success: false,
                message: "User Not Found"
            });
        }

        res.json({success: true, enrolledCourses: userData.enrolledCourses});

    }catch(error){
        res.json({success: false, message:error.message})
    }
}

//update user course progress
export const updateUserCourseProgress = async (req,res)=>{
    try {
        const { userId } = getAuth(req);
        const { courseId, lectureId } = req.body;
        const progressData = await CourseProgress.findOne({userId, courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success: true, message: 'Lecture Already Completed'})
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }
        res.json({success: true, message: 'progress updated'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// get user course progress
export const getUserCourseProgress = async(req,res) => {
    try {
        const { userId } = getAuth(req);
        const { courseId } = req.body;
        const progressData = await CourseProgress.findOne({userId, courseId}) 

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Add user ratings 