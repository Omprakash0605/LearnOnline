import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller Function to manage clerk user with database

export const clerkWebhooks = async (req, res)=>{
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const {data,type} = req.body

        const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ').trim() || 'User';
        const email = data.email_addresses?.[0]?.email_address || '';

        switch(type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email,
                    name: fullName,
                    imageUrl: data.image_url || '',
                }
                await User.create(userData);
                return res.json({ success: true, message: 'User created' });
            }
            case 'user.updated': {
                const userData = {
                    email,
                    name: fullName,
                    imageUrl: data.image_url || '',
                }
                await User.findByIdAndUpdate(data.id, userData);
                return res.json({ success: true, message: 'User updated' });
            }

            case 'user.deleted' : {
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true, message: 'User deleted' });
            }

            default:
                return res.json({ success: true, received: true });
        }

    } catch (error){
        return res.status(400).json({success: false, message: error.message})
    }
};
