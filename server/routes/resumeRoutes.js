const express = require('express');
const router = express.Router();
const {getResume} = require('../controllers/resumeController')


router.get('/resume',async(req,res)=>{
    
    let resumeDetails = getResume(req.query.email);
    if (!resumeDetails) {
       return res.status(200).send({
            success:false,
            message:'Make a resume'
        })
    }

    return res.status(200).send({
        success:true,
        resume: resumeDetails
    })

})


router.get('/')

module.exports = router;

