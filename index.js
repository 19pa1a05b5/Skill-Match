require('dotenv').config();
console.log(process.env.MONGO_URL);

const express = require('express');

const { userRouter } = require('./routes/user');
const { employerRouter } = require('./routes/employer');
const { jobsRouter } = require('./routes/jobs');

const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/employer", employerRouter);
app.use("/api/v1/jobs", jobsRouter);


async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to database!");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch(() => {
        console.log("Connection failed");
    });
}
main();