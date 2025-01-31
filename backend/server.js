import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dotenv from "dotenv";
import connectMongoDb from "./db/connectMongoDb.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";
import cors from "cors";

const app=express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json()); // To parse JSON bodies
app.use(express.static('uploads'));
app.use(express.json({limit : "50mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('uploads'));
app.use(cookieParser());
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})
const PORT=process.env.PORT || 8000;
app.get("/", (req, res) => {
    res.send("server is ready");
})
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectMongoDb();
})