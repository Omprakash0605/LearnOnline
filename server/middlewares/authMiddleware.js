import { clerkClient, getAuth } from "@clerk/express"

// Middleware (Protect Educator Routes) - Checks whether the logged-in user is an educator.
export const protectEducator = async (req, res, next) => {
    try {
        const { userId, isAuthenticated } = getAuth(req);

        if (!isAuthenticated || !userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. Please login.'
            });
        }

        const user = await clerkClient.users.getUser(userId);

        if (user?.publicMetadata?.role !== 'educator') {
            return res.status(403).json({
                success: false,
                message: 'Only educators can access this route'
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};