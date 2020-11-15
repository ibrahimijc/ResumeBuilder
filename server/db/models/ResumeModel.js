const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    
    Name:{
        type:String
    },
    Email:{
        type:String,
        required:true
    },
    Contact:{
        type:String
    },
    selfDescription:{
        type:String
    },
    workHistory:[
        {
            CompanyName:{
                type:String
            },
            Position:{
                Title:String,
                From:String,
                To:String,
                workDescription:[String]
            }
        }
    ],

    educationHistory:[
        {
            Institute:String,
            From:String,
            To:String,
            Degree:String,
            Grade:String,
        }
    ],

    skills:[String],
    AwardsnHonors:[String],
    // Array/Order of Preference in which the user wants their resume sections
    Preference:[String]

});

ResumeSchema.index({ Email:1 }, { unique:true } )

const Resumes = mongoose.model('Resumes',ResumeSchema);


module.exports = Resumes;