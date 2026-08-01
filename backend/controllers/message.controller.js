import Message from "../models/message.model.js"
import { io } from "../lib/socket.js";
import cloudinary from  "../lib/cloudinary.js";
import User from "../models/user.model.js";


export const getMessages = async(req, res) => {
    try{
        const messages = await Message.find().populate("senderId","fullname profilePic");
        res.status(200).json(messages);
    }catch(error){
        console.log("ERROR in getMessages controller: ", error);
        res.status(500).json({message: "Error in fetching all Messges"});
    }
}

// const extractTags = (text) => {
//     const regex = /@(\w+)/g;
//     let match;
//     const tags = [];
//     while ((match = regex.exec(text)) !== null) {
//         console.log("HOlas", match[1]);
//       tags.push(match[1]);
//     }
//     return tags;
// };

export const sendMessage = async(req,res) => {
    try{
        const { text, image, ids: taggedUserIds } = req.body;
        // console.log(ids);

        // const taggedUsernames = extractTags(text);
        // let taggedUserIds = [];

        // if(taggedUsernames.length){
        //     const users = await User.find({fullname: { $in: taggedUsernames }});
        //     taggedUserIds = users.map(u => u._id);
        // }


        const senderId = req.user._id;
        console.log(text);
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const recentSavedMsg = await Message.findOne({
            senderId,
            text,
            image: imageUrl,
          }).populate("senderId", "fullname profilePic");

        console.log("hehe", recentSavedMsg);

          // populate function is used only when the field (here senderId) is an ObjectId referring to another collection.
          
        // console.log(taggedUserIds);

        const outgoingMessages = {
            ...recentSavedMsg.toObject(),
            taggedUserIds
        }

        console.log(outgoingMessages);

        io.emit("newMessage",outgoingMessages);

        res.status(201).json(recentSavedMsg);   

    }catch(error){
        console.log("ERROR in sendMessage controller: ", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const getUsers = async(req, res) => {
    try {
        const users = await User.find({}, "id, fullname");
        res.json(users);
    } catch (error) {
        console.log("Error fetching users", error);
        res.status(500).json({message: "Error in fetching all users"});
    }
}