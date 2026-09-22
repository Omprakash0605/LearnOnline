import { CourseProgress } from "../models/CourseProgress.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import { getAuth } from "@clerk/express";
import mongoose from "mongoose";

// get user data
export const getUserData = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// users enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
        }

        const userData = await User.findById(userId).populate('enrolledCourses');

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        res.json({ success: true, enrolledCourses: userData.enrolledCourses || [] });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Enroll course with dummy payment
export const purchaseCourse = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { courseId } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
        }

        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: 'Valid Course ID is required' });
        }

        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }

        if (!courseData) {
            return res.status(404).json({ success: false, message: 'Course Not Found' });
        }

        // Check if user is already enrolled
        const isAlreadyEnrolled = (userData.enrolledCourses || []).some(
            (id) => id.toString() === courseId.toString()
        );

        if (isAlreadyEnrolled) {
            return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
        }

        // Calculate purchase amount (price after discount)
        const discount = Math.max(0, Math.min(100, Number(courseData.discount) || 0));
        const price = Number(courseData.coursePrice) || 0;
        const amount = Math.max(0, price - Math.floor((discount * price) / 100));

        // Create completed Purchase record (Dummy payment)
        const newPurchase = await Purchase.create({
            courseId: courseData._id,
            userId,
            amount,
            status: 'completed'
        });

        // Add to user's enrolledCourses
        if (!userData.enrolledCourses) {
            userData.enrolledCourses = [];
        }
        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        // Add to course's enrolledStudents
        if (!courseData.enrolledStudents) {
            courseData.enrolledStudents = [];
        }
        if (!courseData.enrolledStudents.includes(userId)) {
            courseData.enrolledStudents.push(userId);
            await courseData.save();
        }

        return res.json({
            success: true,
            message: 'Enrolled successfully!',
            purchase: newPurchase
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// update user course progress
export const updateUserCourseProgress = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
        }

        const { courseId, lectureId } = req.body;
        if (!courseId || !lectureId) {
            return res.status(400).json({ success: false, message: 'Course ID and Lecture ID are required' });
        }

        const progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' });
            }

            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
        } else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            });
        }
        res.json({ success: true, message: 'Progress updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// get user course progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
        }

        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, message: 'Course ID is required' });
        }

        const progressData = await CourseProgress.findOne({ userId, courseId });
        res.json({ success: true, progressData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add user ratings to course 
export const addUserRating = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { courseId, rating } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
        }

        const numericRating = Number(rating);
        if (!courseId || !numericRating || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ success: false, message: 'Invalid details. Rating must be between 1 and 5.' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const user = await User.findById(userId);
        if (!user || !user.enrolledCourses || !user.enrolledCourses.some(id => id.toString() === courseId.toString())) {
            return res.status(403).json({ success: false, message: 'User has not purchased this course.' });
        }

        if (!course.courseRatings) {
            course.courseRatings = [];
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            course.courseRatings[existingRatingIndex].rating = numericRating;
        } else {
            course.courseRatings.push({ userId, rating: numericRating });
        }
        await course.save();

        return res.json({ success: true, message: 'Rating added' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};