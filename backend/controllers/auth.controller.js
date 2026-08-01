import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary, { uploadOnCloudinary } from "../lib/cloudinary.js";  
import ApiError from "../constants.js/ApiError.js";
import nodemailer from "nodemailer";
import dns from "dns";
import axios from "axios";
import { ccRatingFetchKrDeBhai, cfRatingFetchKrDeBhai, leetRatingFetchKrDeBhai } from "../lib/utils.js";
import OtpModel from "../models/otp.model.js";

export const isDisposableEmail = async (email) => {
  const domain = email.split('@')[1];
  const response = await axios.get(`https://open.kickbox.com/v1/disposable/${domain}`);
  return response.data.disposable;
}

export const checkMXRecords = async (email, callback) => {
  const domain = email.split('@')[1];
  dns.resolveMx(domain, (err, addresses) => {
    if(err || addresses.length===0){
      callback(false); // Invalid email Domain
    }else{
      callback(true); // valid email Domain
    }
  })
}

export const signup = async (req, res) => {
  const { fullname, email, password, branch, year, college, ccId, cfId, leetId } = req.body;

  try {

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const isDisposable = await isDisposableEmail(email);
    if (isDisposable) {
      return res.status(400).json({ message: "Fake email Id detected" });
    }

    const mxValid = await new Promise((resolve) => {
      checkMXRecords(email, (isValid) => {
        resolve(isValid);
      });
    });
    if (!mxValid) {
      return res.status(400).json({ message: "Invalid email domain" });
    }


    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedCcData = await ccRatingFetchKrDeBhai(ccId);
    const updatedCfData = await cfRatingFetchKrDeBhai(cfId);
    const updatedLeetData = await leetRatingFetchKrDeBhai(leetId);


    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      branch,
      year,
      college,
      codechefId: ccId,
      codeforcesId: cfId,
      leetcodeId: leetId,
      ...updatedCcData,
      ...updatedCfData,
      ...updatedLeetData,
      authProvider: "local",
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json(newUser);
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).lean();  //.lean() converts user(a mongoose document) to a js object as i was destructuring it below and removing password field form it.

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    const { password : userPassword, ...userWithoutPassword } = user;    // password ka naam userPassword de diya, as it was creating problem as req.body se bhi password mil rha hai, so ye usse confuse kr rha tha.
    res.status(200).send(userWithoutPassword);

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshRating = async (req, res) => {
  try{
    const {objId, leetId, ccId, cfId} = req.body;

    const updatedCcData = await ccRatingFetchKrDeBhai(ccId);
    const updatedCfData = await cfRatingFetchKrDeBhai(cfId);
    const updatedLeetData = await leetRatingFetchKrDeBhai(leetId);

    await User.updateOne(
      {_id: objId},
      {
        $set : {
          ...updatedCcData,
          ...updatedCfData,
          ...updatedLeetData
        }
     }
    );

    const updatedUser = await User.findById(objId).lean();

    if(updatedUser){
      res.status(201).json(updatedUser);
    }
    else{
      res.status(500).json({message: "bhai , user not found"});
    }

  }catch(error){
    console.log("Error in refreshRating controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const updateCodingIds = async (req, res) => {
  try {
    const {objId, ccId, cfId, leetId} = req.body;

    console.log(ccId, cfId, leetId);

    const updatedCcData = await ccRatingFetchKrDeBhai(ccId);
    const updatedCfData = await cfRatingFetchKrDeBhai(cfId);
    const updatedLeetData = await leetRatingFetchKrDeBhai(leetId);

    await User.updateOne(
      {_id: objId},
      {$set: {
        codechefId: ccId,
        codeforcesId: cfId,
        leetcodeId: leetId,
        ...updatedCcData,
        ...updatedCfData,
        ...updatedLeetData,
      }}
    )

    const updatedUser = await User.findById(objId).lean();

    if(updatedUser){
      res.status(201).json(updatedUser);
    }
    else{
      res.status(500).json({message: "bhai , user not found"});
    }

  } catch (error) {
    console.log("error in updateCodingIds:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try{
    const {objId, fullname, email, college, branch, year} = req.body;
    
    await User.updateOne(
      {_id: objId},
      {$set: {
        fullname,
        email,
        college,
        branch,
        year,
      }}
    );

    const updatedUser = await User.findById(objId).lean();

    if(updatedUser){
      res.status(201).json(updatedUser);
    }
    else{
      res.status(500).json({message: "bhai , user not found"});
    }
  } catch (error) {
    console.log("error in updateProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateImage = async (req, res) => {
  try{
    const {objId} = req.body;
    // console.log(req.body);
    let profilePicLocalPath;
    // console.log(objId);
    if(req.files && Array.isArray(req.files.image) && req.files.image.length >0){
      // console.log("HHSHFH");
      profilePicLocalPath = req.files.image[0].path;
    }
    console.log("Hola", profilePicLocalPath);
    const profilePic = await uploadOnCloudinary(profilePicLocalPath);

    await User.updateOne(
      {_id: objId},
      {$set: {
        profilePic: profilePic.url
      }}
    )

    const updatedUser = await User.findById(objId).lean();

    if(!updatedUser){
      return res.status(500).json({message: "User can't find"});
    }
    res.status(201).json(updatedUser);
  } catch(error){
    console.log("error in update image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const removeImage = async( req, res) => {
  try{
    console.log(req.body);
    const {objId} = req.body;
    console.log(objId);

    await User.updateOne(
      {_id: objId},
      {$unset: {
        profilePic: ""
      }}
    )
    
    const updatedUser = await User.findById(objId).lean();

    if(!updatedUser){
      return res.status(500).json({message: "User can't find"});
    }
    res.status(201).json(updatedUser);

  } catch (error) {
    console.log("error in removing image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const checkAuth = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("req.body: ", req.body);
    console.log("notitoken recieved at backend: ", token);
    const userId = req.user._id;
    
    const updatedUser = await User.findByIdAndUpdate(userId, {notiToken: token}, {new: true})  //{new: true} return updated document.
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getTotalUsers = async (req, res) => {
  try{
    const totalUsers = await User.countDocuments();
    res.status(200).json(totalUsers);
  } catch(error){
    console.log("Error in getTotalUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const oauthLoginUser = async(req,res) => {
  try {
    const {fullName, email, authProvider} = req.body

    if( [fullName, email, authProvider].some((field) => field?.trim()==="")) return res.status(404).json({message: "All fields are required"});

    const curr_user = await User.findOne({email: email});
    if(!curr_user) return res.status(404).json({message: "user doesn't exists"});
    
    generateToken(curr_user._id, res);
  
    const { password : userPassword, ...userWithoutPassword } = curr_user.toObject();  // It is required as
    // curr_user is a mongoose document and it have several other properties which are not generally desired.
    console.log("Hola amigo", curr_user);  
    res.status(200).send(userWithoutPassword);

  } catch (error) {
    console.log("Error in oauthLoginUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const oauthUser = async (req, res) => {
  console.log("AMigo it's oauthUser");
  console.log("Data coming from frontend to oauthUser: ", req.body);
  try {
    const {fullname, email, authProvider, branch, college, year, ccId, cfId, leetId} = req.body
    if([fullname, email, authProvider, branch, college, year, ccId, cfId, leetId].some((field) => field?.trim()===""))
    { return res.status(404).json({message: "All fields are required"}); }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const password = "123456";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const updatedCcData = await ccRatingFetchKrDeBhai(ccId);
    const updatedCfData = await cfRatingFetchKrDeBhai(cfId);
    const updatedLeetData = await leetRatingFetchKrDeBhai(leetId);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      branch,
      year,
      college,
      codechefId: ccId,
      codeforcesId: cfId,
      leetcodeId: leetId,
      ...updatedCcData,
      ...updatedCfData,
      ...updatedLeetData,
      authProvider
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json(newUser);
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in oauthUser controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const generateOTP = async (req, res) => {
  // console.log("HOla");
    const { email} = req.body;
    console.log(email);
    if (!email) return res.status(400).json({ error: 'Please provide registered email address' });
    // console.log(isSignup);

    const matchedMail = User.findOne({email});
    if(!matchedMail) return res.status(400).json({ error: 'Please provide registered email address' });
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USER,      
        pass: process.env.EMAIL_PASS  
        }
    });

    const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);

    let mailOptions = {
        from: process.env.EMAIL_RECEIVER,
        to: `<${email}>`, 
        subject: `We've processed your request to HACC`,
        text: `Hey user\n Welcome to HACC \n Your OTP is ${randomSixDigitNumber}`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
        // if(isSignup){
        //   console.log("Hii");
        //   await OtpModel.findOneAndUpdate(
        //     { email: email },
        //     { otp: randomSixDigitNumber, expiresAt: Date.now() + 10 * 60 * 1000 },
        //     { upsert: true }
        //   )
        // }else{
          await User.findOneAndUpdate(
            { email: email }, 
            { $set: { otp: randomSixDigitNumber } }, 
            { $set: {authProvider: "otp"}},
          );
        // }
        res.json({ message: 'Your message has been sent successfully.' });
    }catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'There was an error sending your message.' });
    }
}

export const loginWithOTP = async (req, res) => {
  try {
    const { email, OTP } = req.body;
    console.log(OTP);
    console.log(email);
    if (!email || !OTP) {
      return res.status(400).json({ error: 'Please provide registered email address and OTP'});
    }
    const curr_user = await User.findOne({email}).lean();
    // console.log(curr_user.otp);
  
    if(!curr_user || String(curr_user.otp) !== String(OTP)){
      return res.status(400).json({message: "Invalid Credentials"});
    }
  
    generateToken(curr_user._id, res);
  
    const { password : userPassword, ...userWithoutPassword } = curr_user;    
    res.status(200).send(userWithoutPassword);

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

// export const signUpWithOTP = async (req, res) => {
//   console.log(req.body);
//   try {
//     const { email, OTP } = req.body;
//     console.log(OTP);
//     console.log(email);
//     if (!email || !OTP) {
//       return res.status(400).json({ error: 'Please provide a valid email address and OTP'});
//     }
//     const curr_user = await OtpModel.findOne({email}).lean();
//     console.log("HOLA AMIGO", curr_user);
  
//     if(Date.now()>curr_user.expiresAt){
//       return res.status(400).json({message: "OTP Expired"});
//     }
  
//     if(!curr_user || String(curr_user.otp) !== String(OTP)){
//       return res.status(400).json({message: "Invalid Credentials"});
//     }

//     res.status(200).json({message: "OTP verified successfully"});

//   } catch (error) {
//     console.log("Error in Signup controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }


export const changePassword = async (req, res) => {
  try {
    const {email, oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword || !email){
      return res.status(400).json({ error: 'Please provide required credentials'});
    }
    
    const curr_user = await User.findOne({email: email});
    if(!curr_user){
      return res.status(400).json({message: "user doesn't exists"});
    }

    if(curr_user.password !== oldPassword){
      return res.status(400).json({message: "Incorrect Old Password"});
    }

    curr_user.password = newPassword;
    await curr_user.save({validateBeforeSave: false});

    return res.status(200).json({message: "Password changed successfully"});

  } catch (error) {
    console.log("Error in changing password", error.message);
  }
}




