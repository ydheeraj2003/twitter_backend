import mongoose from "mongoose";

const connectMongoDb = async () => {
    try{
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    }
    catch(error){
        console.log(`error connecting mongodb: ${error}`);
    }
}

export default connectMongoDb;