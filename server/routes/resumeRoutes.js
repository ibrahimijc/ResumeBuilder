const express = require('express');
const Resume = require('../classes/Resume');
const router = express.Router();
const {getResume, saveResume} = require('../controllers/resumeController')


// Returns the resume object, for filling the fields on front end
router.get('/resume',async(req,res)=>{
    // Email is must
    if (!req.query.Email)
        return res.status(400).send({success:false,message:'Email is Required'})
    try{
        let resumeDetails = await getResume(req.query.Email);
        if (!resumeDetails)
            return res.status(400).send({ success:false,message :'resume not found' });

        return res.status(200).send({ success:true,resume:resumeDetails })
    }catch(e){
        console.log(e);
        res.status(400).send({
            success:false,
            message:'Resume not found'
        })
    }
})

// Send the pdf in blob format if possible, else will have to serve the pdf's for download
router.get('/print',async(req,res)=>{
    const { email } = req.query;

    if (!email)
        return res.status(400).send({success:false,message:'email required'});
    // Gets the Resume object after fetching from db and mapping to Resume class
    const myResume = await getResume(email);

    if (!myResume)
        return res.status(404).send({success:false,message:'user does not exist'})
    myResume.setStyles();
    myResume.setContentWithPreference()
    // Creating binary stream
    let result= await myResume.createPdfBinary();
    res.contentType('application/pdf');
    res.send(result)
});

router.post('/skills',async(req,res)=>{
    const { skills, email } = req.query;

    if (! (skills && email))
        return res.status(400).send({ message:' email and skills required '});
    const existingResum = await getResume(email);
    if (!existingResum)
        res.status(400).send({success:false,message:'user does not exist'});
})

router.post('/About',()=>{

})

router.post('/PersonalDetails',()=>{

})

// Endpoint to Save complete Resume at once. 
router.post('/completeResume',async(req,res)=>{
    console.log(req.body);
    try{
        await saveResume(req.body);
        res.status(200).send({success:true , message:'resume has been saved'})
    } catch(e){
        // Mongo duplicate key error
        if (e.code==11000)
           return res.status(500).send({success:false,message:'duplicate error'})

         return res.status(500).send({success:false , message:e.message})
    }
})



module.exports = router;

