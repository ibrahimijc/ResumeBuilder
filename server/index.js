// Library Imports
const express = require('express');
const app = express();

// Helper includes
const resumeRouter = require('./routes/resumeRoutes');


// Using routers for 
app.use('/',resumeRouter);

// .env variables.
const PORT = process.env.PORT || 5000;

// Server listening
app.listen(PORT, ()=>{
    console.log('listening at PORT # ', PORT);
})