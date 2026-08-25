import { clerkClient, getAuth } from '@clerk/express'
import Course from '../models/Course.js'
import { v2 as cloudinary } from 'cloudinary'

//update role to educator 
export const updateRoleToEducator =async (req, res)=>{
    try {
        
        console.log("REQ.AUTH:", req.auth);
        console.log("AUTHORIZATION:", req.headers.authorization);

        const { userId,isAuthenticated } = getAuth(req);


        if (!isAuthenticated || !userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found"
            });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        })

        console.log("ROLE UPDATED FOR:", userId)

        res.json({
            success: true,
            message: "You can publish a course now",
        });

    }catch(error){
        console.log("ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//Add new course
export const addCourse = async (req, res)=>{
    try {
        // Get authenticated Clerk user
        const { userId, isAuthenticated } = getAuth(req)

        if (!isAuthenticated || !userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. Please login.'
            })
        }

        const { courseData } = req.body
        const imageFile = req.file

        // Check thumbnail
        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: 'Thumbnail not attached'
            })
        }

        // Check course data
        if (!courseData) {
            return res.status(400).json({
                success: false,
                message: 'Course data is missing'
            })
        }

        // Convert JSON string → JavaScript object
        const parsedCourseData = JSON.parse(courseData)

        // Attach educator's Clerk ID
        parsedCourseData.educator = userId

        // Create course in MongoDB
        const newCourse = await Course.create(parsedCourseData)

        // Upload thumbnail to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(
            imageFile.path
        )

        // Save Cloudinary URL
        newCourse.courseThumbnail = imageUpload.secure_url

        await newCourse.save()

        return res.status(201).json({
            success: true,
            message: 'Course Added',
        })

    } catch (error) {
        console.error('ADD COURSE ERROR:', error)

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



//get educator courses 
export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        const courses = await Course.find({ educator: userId });

        res.json({
            success: true,
            courses
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

//Get Educator Dashboard Data (Total Earning, Enrolled Students, No. of Courses)

export const eduacatorDashboardData = async ()=>{
    try{
        const { userId } = getAuth(req);
        const courses = await Courses.find({eduactor: userId});
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);
        
        //Calculate total earnings from purchases
        const purchases =await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase)=> sum + purchase.amount, 0);

        //collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name imageUrl');
        }

        students.forEach(student => {
            enrolledStudentsData.push({
                courseTitle: course.courseTitle,
                student
            });
        });

        res.json({success:true, dashboardData:{
            totalEarnings, enrolledStudentsData, totalCourses
        }})

    }catch(error){
        res.json({success: false, message: error.message});
    }
}

//get enrolled students data with purchase data
export const getEnrollledStudentsData = async(req,res)=>{
    try {
        const { userId } = getAuth(req);
        const courses = await Courses.find({eduactor: userId});
        const courseIds = courses.map(course=> course._id);

        const purchase = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase =>({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseData: purchase.createdAt
        }));

        res.json({success:true, enrolledStudents})

    } catch (error) {
        res.json({ success:false, message:error.message});
    }
}