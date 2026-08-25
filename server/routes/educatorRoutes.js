import express from 'express'
import { addCourse, eduacatorDashboardData, getEducatorCourses, getEnrollledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js'
import upload from '../configs/multer.js'
import { protectEducator } from '../middlewares/authMiddleware.js'

const educatorRouter = express.Router()

// Anyone who is logged in can request educator role
educatorRouter.get('/update-role', updateRoleToEducator)

// Only educators can add courses
educatorRouter.post('/add-course',upload.single('image'), protectEducator, addCourse)


educatorRouter.get('/courses', protectEducator, getEducatorCourses)

educatorRouter.get('/dashboard',protectEducator, eduacatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrollledStudentsData)


export default educatorRouter;


