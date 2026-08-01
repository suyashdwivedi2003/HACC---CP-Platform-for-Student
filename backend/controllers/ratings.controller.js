import User from "../models/user.model.js";

const fetchData = async(req, res) => {
    const userData = await User.find().select("fullname codechefId codeforcesId leetcodeId forcesRating chefRating leetRating college year profilePic");
    if(!userData){
        return res.status(400).json({message: "user not found"});
    }
    return res.status(200).json(userData);
}

export {fetchData};