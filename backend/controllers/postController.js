import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notificationModel.js";
//import multer from "multer";

//import cloudinary from 'cloudinary';
//import videoUpload from '../middleware/upload.js';
export const createPost = async(req,res) =>{
    try
    {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();
        const user=await User.findById(userId);
        if (!user) return res.status(400).json({message : "user not found"});
        if (!text && !img)
        {
            return res.status(400).json({message : "post must be image or text"});
        }
        if (img)
        {
            const uploadedResponse=await cloudinary.uploader.upload(img);
            img=uploadedResponse.secure_url;
        }
        const newPost = new Post({
            user: userId,
            text,
            img
        })
        await newPost.save();
        return res.status(200).json(newPost);

    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
}
  
export const deletePost = async(req,res) => {
    try 
    {
        const post=await Post.findById(req.params.id);
        if (!post)
        {
            return res.status(400).json({message: "post not found to delete"});
        }
        if (post.user.toString() !== req.user._id.toString())
        {
            return res.status(400).json({message: "You can only delete your posts"});
        }
        if (post.img)
        {
            const imgId=post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "post deleted"});
    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
}

export const commentOnPost = async(req,res) => {
    try
    {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
         
        if (!text)
        {
            return res.status(400).json({message:"comment must be text"});
        }
        const post=await Post.findById(postId);
        if (!post)
        {
            return res.status(400).json({message : "post not found"});
        }
        const comment={user:userId, text};
        post.comments.push(comment);
        await post.save();
        return res.status(200).json(post);
    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
}

export const likeUnlikePost = async(req, res) => {
    try 
    {
        const userId=req.user._id;
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if (!post)
        {
            return res.status(400).json({message : "no post found"});
        }
        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost)
        {
            await Post.updateOne({_id : postId}, {$pull : {likes : userId} });
            await User.updateOne({_id : userId}, {$pull : {likedPosts : postId}});
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            
            {/*
            await Notification.deleteOne({
                from: userId,
                to: post.user,
                type: "like",
                postId: postId,
            });
            */}
            await Notification.findOneAndDelete({
                from: userId,
                to: post.user,
                type: "like",
            });

            return res.status(200).json(updatedLikes);
        }
        else 
        {
            post.likes.push(userId);
            await User.updateOne({_id : userId}, {$push : {likedPosts : postId}});

            await post.save();

            const notification = new Notification({
                from : userId,
                to : post.user,
                type: "like"
            })
            await notification.save();
            const updatedLikes=post.likes;
            return res.status(200).json(updatedLikes);
        }

    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
}

export const getAllPosts = async(req,res) => {
    try 
    {
        const posts=await Post.find().sort({createdAt: -1}).populate({
            path : "user",
            select : "-password"
        }).populate({
            path : "comments.user",
            select : "-password" 
        });
        if (posts.length === 0)
        {
            return res.status(200).json([]);
        }
        return res.status(200).json(posts);
    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
}

export const getLikedPosts = async (req,res) => {
    const userId=req.params.id;
    try 
    {
        const user=await User.findById(userId);
        if (!user)
        {
            return res.status(400).json({message: "user not found"});
        }
        const likedPosts=await Post.find({_id : {$in : user.likedPosts}}).populate({
            path : "user",
            select : "-password"
        }).populate({
            path: "comments.user",
            select : "-password"
        });
        return res.status(200).json(likedPosts);
    }   
    catch(error)
    {
        return res.status(500).json({error: "internal server error"});
    }
}

export const getFollowingPosts = async(req,res) => {
    try 
    {
        const userId=req.user._id;
        const user=await User.findById(userId);
        if (!user)
        {
            return res.status(400).json({message : "user not found"});
        }
        const following=user.following; 
        const feedPosts = await Post.find({user : {$in : following}}).sort({createdAt: -1}).populate({
            path : "user",
            select : "-password"
        }).populate({
            path : "comments.user",
            select : "-password"
        });
        return res.status(200).json(feedPosts);
    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
}

export const getUserPosts =async(req,res) => {
    try 
    {
        const {username} = req.params;
        const user=await User.findOne({username});
        if (!user)
        {
            return res.status(400).json({message : "user not found"});
        }
        const posts=await Post.find({user: user._id}).sort({createdAt: -1}).populate({
            path : "user",
            select : "-password"
        }).populate({
            path : "comments.user",
            select : "-password"
        });
        return res.status(200).json(posts);

    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
}