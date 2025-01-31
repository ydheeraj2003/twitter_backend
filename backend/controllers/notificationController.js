import Notification from "../models/notificationModel.js";

export const getNotifications = async(req, res) => {
    try 
    {
        const userId=req.user._id;
        const notifications=await Notification.find({to : userId}).populate({
            path : "from",
            select : "username profileImg"
        });
        await Notification.updateMany({to : userId}, {read: true});
        console.log(notifications);
        return res.status(200).json(notifications);
    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
} 

export const deleteNotifications = async(req, res) => {
    try 
    {
        const userId=req.user._id;
        await Notification.deleteMany({to : userId});
        return res.status(200).json({message : "notifications deleted"});
    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
}

export const deleteOneNotification = async(req, res) => {
    try 
    {
        const notificationId=req.params.id;
        const userId=req.user._id;
        const notification=await Notification.findById(notificationId);
        if (!notification)
        {
            return res.status(400).json({message : "notification not found"});
        }
        if (notification.to.toString() !== userId.toString())
        {
            return res.status(400).json({message : "You cant delete other user notification"});
        }
        await Notification.findByIdAndDelete(notificationId);
        return res.status(200).json({message : "one notification deleted"});
    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
}