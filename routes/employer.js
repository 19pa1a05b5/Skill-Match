require("dotenv").config();
const { Router } = require('express');
const employerRouter = Router();
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { employerModel, jobModel } = require('../db');
const { employerMiddleware } = require("../middleware/employer");

employerRouter.post("/signup", async function(req,res) {
    const requiredBody = z.object({
        email: z.string().min(3).max(30).email(),
        password: z.string().min(3).max(30),
        firstName: z.string().min(3).max(30),
        lastName: z.string().min(3).max(30)
    })

    const parsedData = requiredBody.safeParse(req.body);
    if(parsedData.success){
        const hashedPassword = await bcrypt.hash(parsedData.data.password,5);
        try{
            await employerModel.create({
                email:parsedData.data.email,
                password: hashedPassword,
                firstName: parsedData.data.firstName,
                lastName: parsedData.data.lastName,
                contact: req.body.contact
            });

            res.json({
                message: "employer signup"
            });

        }catch(e){
            res.json({
                message: "employer signup unsuccessful"
            })
        }
    }else{
        res.json({
            message: parsedData.error.issues[0].message
        })
    }
});

employerRouter.post("/signin", async function(req,res) {
    const {email, password} = req.body;

    const employer = await employerModel.findOne({
        email: email
    })

    if(employer){
        const checkPassword = await bcrypt.compare(password,employer.password);
        if(checkPassword){
            const token = jwt.sign({
                id: employer._id
            }, process.env.JWT_EMPLOYER_PASSWORD);

            res.json({
                token: token,
                message: "signin successfull"
            })
        }else{
            res.json({
                message: "Password incorrect"
            })
        }
    }else{
        res.json({
            message: "Invalid Email"
        })
    }
});

employerRouter.post("/jobs", employerMiddleware, async function (req,res) {
    const employerId = req.id;

    const { title, description, requiredSkills, location, salaryRange, createdAt} = req.body;

    const job = await jobModel.create({
        creatorId: employerId,
        title: title,
        description: description,
        requiredSkills: requiredSkills,
        location: location,
        salaryRange: salaryRange,
        createdAt: createdAt
    });

    res.json({
        message: "job created",
        jobId: job._id
    });
});

employerRouter.put("/jobs", employerMiddleware, async function (req,res) {
    const employerId = req.id;

    const { title, description, requiredSkills, location, salaryRange, createdAt, jobId} = req.body;

    const job = await jobModel.updateOne({
        _id: jobId,
        creatorId: employerId
    },{
        title:title,
        description: description,
        requiredSkills: requiredSkills,
        location: location,
        salaryRange: salaryRange,
        createdAt: createdAt
    });

    res.json({
        message: "job got updated",
        jobId: job._id
    });
});

employerRouter.get("/jobs/posted", employerMiddleware, async function(req,res) {
    const employerId = req.id;

    const jobs = await jobModel.find({
        creatorId: employerId
    })

    res.json({
        message: "jobs posted by the employer",
        jobs
    })
})

module.exports = {
    employerRouter: employerRouter
}