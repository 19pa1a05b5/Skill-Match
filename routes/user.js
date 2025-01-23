// const express = require('express');
// const Router = express.Router;
require('dotenv').config();
const { Router } = require('express');
const userRouter = Router();
const jwt = require("jsonwebtoken");
const {z} = require("zod");
const bcrypt = require("bcrypt");

const { userModel } = require("../db");

userRouter.post('/signup',async function(req,res)  {
    const requiredBody = z.object({
        email: z.string({
            required_error: "email is required"
          }).min(3).max(100).email(),
        password: z.string({
            required_error: "password is required"
          }).min(8).max(30),
        firstName: z.string({
            required_error: "First name is required",
            invalid_type_error: "First name must be a string",
          }).min(3).max(30),
        lastName: z.string({
            required_error: "Last name is required",
            invalid_type_error: "Last name must be a string",
          }).min(3).max(30),
        // address: z.string().min(3).max(100),
        // contact: z.number()
    });

    const parsedData = requiredBody.safeParse(req.body);
    if(parsedData.success){
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 5);
        try{
            await userModel.create({
                email: parsedData.data.email,
                password: hashedPassword,
                firstName: parsedData.data.firstName,
                lastName: parsedData.data.lastName,
                address: req.body.address,
                contact: req.contact
            });
            res.json({
                message: "signup successfull"
            });
        }catch(e){
            res.json({
                message: "Signup unsuccessfull"
            });
        }
    }else{
        res.json({
            message: parsedData.error.issues[0].message
        })
    }
    
});

userRouter.post('/signin',async function (req,res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({
        email: email
    });

    if(user){
        const checkPassword = await bcrypt.compare(password,user.password);
        if(checkPassword){
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_USER_PASSWORD);
    
            res.json({
                token:token,
                message: "signin successfull"
            })
        }else{
            res.status(403).json({
                message: "Incorrect password"
            })
        }
    }else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
});

userRouter.get('/jobs/applied',(req,res) => {
    res.json({
        message: "user signup endpoint"
    });
});

module.exports = {
    userRouter:userRouter
}