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

//users enrolled courses ith lecturelinks
export const userEnrolledCourses = async (req, res)=>{
    try{
        const {usedId} = getAuth(req);
        const userData = await User.findById(userId).populate('enrolledCourses')

        res.json({success: true, enrolledCourses: userData.enrolledCourses})
    }catch(error){
        res.json({success: false, message:error.message})
    }
}

