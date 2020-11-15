const mongoose = require("mongoose");

const mongoDBEnpoint = process.env.mongoDBURL || 'mongodb://127.0.0.1:27017/ResumeBuilder';
mongoose
    .connect(mongoDBEnpoint, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then((res) => {
        console.log("connected");
    })
    .catch((e) => {
        console.log("Error in Connecting to Mongo ", e.message);
    });

