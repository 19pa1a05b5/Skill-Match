const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email: {type:String, unique:true, required: true},
    password: { type:String, required: true },
    firstName: { type:String, required: true },
    lastName: { type:String, required: true },
    address: String,
    contact: Number
});

const employerSchema = new Schema({
    email: {type:String, unique:true},
    password: { type:String, required: true },
    firstName: { type:String, required: true },
    lastName: { type:String, required: true },
    contact: Number
});

const jobSchema = new Schema({
    creatorId: ObjectId,
    title: { type:String, required: [true, "Please enter the title"] },
    description: { type:String, required: true },
    requiredSkills: {
        type: [String],
    },
    location:String,
    salaryRange: String,
    createdAt: Date
});

const resumeSchema = new Schema({
    userId: ObjectId,
    filePath: { type:String, required: true },
    extractedSkills: [String],
    uploadedAt: Date
});

const jobApplicationSchema = new Schema({
    jobId: ObjectId,
    userId: ObjectId,
    status: {
        type:String,
        enum: ["applied","reviewed","accepted","rejected"],
    },
    appliedAt: Date
})

const userModel = mongoose.model("user",userSchema);
const employerModel = mongoose.model("employer",employerSchema);
const jobModel = mongoose.model("job",jobSchema);
const resumeModel = mongoose.model("resume",resumeSchema);
const jobApplicationModel = mongoose.model("jobApplication",jobApplicationSchema);

module.exports = {
    userModel,
    employerModel,
    jobModel,
    resumeModel,
    jobApplicationModel
}