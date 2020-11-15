const Resume = require('../classes/Resume');
const ResumeModel = require('../db/models/ResumeModel');

async function getResume(Email) {

    let result = await ResumeModel.findOne({
        Email
    })
    if (!result) {
        return null;
    }
    // Coming from db, it'll already be checked.
    let resume = new Resume(result);
    return resume;
}

async function saveResume(params) {
    // Checking if params valid and value exist
    let isValid = validateAttributes(params);
    if (!isValid) {
        throw  Error('not valid attributes or values');
    }
    const resume = new Resume(params);
    // create the resume
    await ResumeModel.create({...resume});
}

function validateAttributes(params) {
    let required = [
        'Email',
        'Name',
        'workHistory',
        'educationHistory',
        'selfDescription',
        'Contact',
        'skills',
        'AwardsnHonors',
    ];
    // Check the param
    const input = Object.keys(params);
    let result = required.every(check => {
        if (input.includes(check) && params[check])
            return true;
        return false;
    })

    return result;
}



module.exports = {
    getResume,
    saveResume
}
