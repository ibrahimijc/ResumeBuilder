// Library Imports
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Helper includes
const resumeRouter = require('./routes/resumeRoutes');

app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Set up mongodb connection
require('./db/mongoose');

// Using routers for 
app.use('/',resumeRouter);

// .env variables.
const PORT = process.env.PORT || 5000;

// Server listening
app.listen(PORT, ()=>{
    console.log('listening at PORT # ', PORT);
})