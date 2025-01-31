import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async(req,res) => {
    try 
    {
        const {fullname, username, email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex)
        {
            return res.status(400).json({error: "Invalid email format"});
        }
        const existingUser=await User.findOne({username});
        if (existingUser)
        {
            return res.status(400).json({error: "Username is already taken"});
        }
        const existingEmail=await User.findOne({email});
        if (existingEmail)
        {
            return res.status(400).json({error: "Email is already taken"});
        }
        if (password.length < 8)
        {
            return res.status(400).json({error: "password must be greater than or equal to 8 characters"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password, salt);

        const newUser=new User({
            fullname,
            username,
            email,
            password: hashedPassword
        })
        if (newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            });
        }
        else 
        {
            res.status(400).json({error: "invalid user data"});
        }
    }
    catch(error)
    {
        return res.status(500).json({error: "internal server error"});
    }
}

export const login = async(req,res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect=await bcrypt.compare(password, user?.password || "");
        if (!user)
        {
            return res.status(400).json({error: "invalid username"});
        }
        if (!isPasswordCorrect)
        {
            return res.status(400).json({error : "invalid password"});
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        });
    }
    catch(error)
    {
        return res.status(500).json({error: "internal server error"});
    }
}

export const logout = async(req,res) => {
    try
    {
        res.cookie("jwt", "", {maxAge:0});
        return res.status(200).json({message: "logged out successfully"});
    }
    catch(error)
    {
        return res.status(500).json({error : "internal server error"});
    }
}

export const getMe = async (req, res) => {
    try
    {
        const user=await User.findById(req.user._id).select("-password");
        return res.status(200).json(user);
    } 
    catch(error)
    {
        return res.status(500).json({error: "internal server error"});
    }
}