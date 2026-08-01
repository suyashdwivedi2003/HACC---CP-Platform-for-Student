import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { type:String, required: true },
    email: { type:String, required: true, unique:true },
    password: { type:String, required: function(){ return this.authProvider === "local" } },
    branch: { type:String },
    year: { type:String },
    college: { type:String },
    codechefId: { type:String, required: true, default: '.' },
    codeforcesId: { type:String, required: true, default: '.' },
    leetcodeId: { type:String, required: true, default: '.' },
    profilePic: { type: String},
    notiToken: {type: String},

    totalLeetQuestions: { type: Number, default: null },
    easyLeetQuestions: { type: Number, default: null },
    mediumLeetQuestions: { type: Number, default: null },
    hardLeetQuestions: { type: Number, default: null },
    totalSolvedLeetQuestions: { type: Number, default: null },
    easySolvedLeetQuestions: { type: Number, default: null },
    mediumSolvedLeetQuestions: { type: Number, default: null },
    hardSolvedLeetQuestions: { type: Number, default: null },
    leetReputation: { type: Number, default: null },
    leetRanking: { type: Number, default: null },
    leetContestCount: { type: Number, default: null },
    leetRating: { type: Number, default: null },
    leetGlobalRanking: { type: Number, default: null },
    leetTotalParticipants: { type: Number, default: null },
    leetTopPercentage: { type: Number, default: null },
    // leetBadges: { type: Number },         //handle it later

    forcesRating: { type: Number, default: null },
    forcesRank: { type: String, default: null },
    forcesMaxRating: { type: Number, default: null },
    forcesMaxRank: { type: String, default: null },
    forcesContestCount: { type: Number, default: null},
    forcesTotalProblemSolved: { type: Number, default: null },
    forcesTotalProblemsolvedByRating: { 
        type: Map, 
        of: Number, 
        default: {} 
    },

    chefRating: { type: Number, default: null },
    chefStars: { type: String, default: null },
    chefTotalProblemSolved: { type: Number, default: null },
    chefContestCount: { type: Number, default: null },
    authProvider: {type: String, enum: ["local", "google", "otp"], required: true},
    otp: {type: Number},
    bookmarkedContests: [ {type: mongoose.Schema.Types.ObjectId , ref: 'Contest'} ],
}, {timestamps:true});

const User = mongoose.model('User', userSchema);

export default User;



