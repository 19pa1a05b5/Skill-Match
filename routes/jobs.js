const {Router} = require("express");

const jobsRouter = Router();

jobsRouter.get("/jobsPosted",(req,res) => {
    res.json({
        message: "jobsPosted"
    });
})

module.exports = {
    jobsRouter: jobsRouter
}