/**
 * Library Imports
 */
var PdfPrinter = require('pdfmake');
const fs = require('fs');

/**
 * Fonts manually downloaded and added for pdf make class
 */
const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};


var printer = new PdfPrinter(fonts);



class Resume {

    constructor(PersonalDetails, Acheivments, Education, WorkHistory) {
        console.log('created');;
        this.PersonalDetails = PersonalDetails;
        this.Acheivments = Acheivments;
        this.Education = Education;
        this.WorkHistory = WorkHistory;

        // This is the main document builder through which we will built whole pdf.
        this.docDefinition = {
            content: [
            ],
            styles: {
            }
        };
    }

    printResume(includingSectionsWithPriority) {
        // console.log(JSON.stringify(this.docDefinition, null, ' '));
        const pdfDoc = printer.createPdfKitDocument(this.docDefinition, {});
        pdfDoc.pipe(fs.createWriteStream('hahah'));
        pdfDoc.end();
        // console.log('here');
    }

    addHeader(Name, Contact, Email, Social) {
        let localContent = [];
        // these are the must required fields
        if (!(Name && Contact && Email))
            throw Error({ message: "Name, Contact, and Email Fields are required" });
        // Push the details in the content to be published on pdf
        
        localContent.push(
            { text: Contact, style: ['general', 'sub-text'] },
            { text: Email, style: ['general', 'sub-text'] })

        // If Social Details are given (Optional)
        if (Social) {
            // Map the links on local object
           Object.values(Social).map(value=>{
                localContent.push(
                    { text: value, link: value, style: ['sub-text', 'general'] }
                )
            })
        }

        
        // Then sort values in order of length and then push them to the content
        localContent.sort(this.compareText).map(value =>{
            this.docDefinition.content.push(value);
        })

        // After the Details push The Name after giving space
        this.docDefinition.content.push(
            { text: "\n\n", style: ['general', 'header'] },
            { text: Name, style: ['general', 'header'] },
        )
    }

    // For the sub-headings to be inserted in length wise order bigger to smaller
    compareText( a, b ) {
        if ( a.text.length < b.text.length ){
          return 1;
        }
        if ( a.text.length > b.text.length ){
          return -1;
        }
        return 0;
      }

    addAbout(personalStatement) {
        let localContent = [];
        if (!personalStatement)
            throw Error({ message: 'Personal Statement is Must' });
        localContent.push(
            { text:'\n\n' },
            {text:"About",style:['general','sub-heading']},
            {text:personalStatement,style:['general']}
            )
        this.docDefinition.content.push(localContent)
    }

    /**
     * 
     * @param {*} workHistory 
     * workHistory: Array of Object
     * Object :{}
     */
    addWorkHistory(workHistory){
        if (!workHistory)
            throw Error({message:'Work History is required'});
        
        let localWorkHistory = [];

        localWorkHistory.push(
            { text:'\n' },
            {text:"Work Experience",style:['general','sub-heading']},
            {text:'\n'}
        )
        
        console.log(JSON.stringify(workHistory,null,' '));
        
        // Seperatelet Work History in two columns. 
        let column1 = [], column2 = [];
        // Map the work history and push to specific colums
        workHistory.map((value,index)=>{

            let mappedDetails = [
                {text:value.Position.Title, style:['general']},
                {text:value.CompanyName, style:['general','sub-text']},
                {text:`${value.Position.From} - ${value.Position.To}`, style:['general','sub-text']},
                {text:'\n'},
                {ul:value.Position.workDescription, style:['general','sub-text','description']},
                {text:'\n'},
            ]

            // If in future need to change the layout of Work Experience
            // column1.push(
            //     {text:value.Position.Title, style:['general']},
            //     {text:value.CompanyName, style:['general','sub-text']},
            //     {text:`${value.Position.From} - ${value.Position.To}`, style:['general','sub-text']},
            // )

            // column2.push(
            //     {text:'\n'},
            //     {ul:value.Position.workDescription, style:['general','sub-text','description']},
            //     {text:'\n'},
            // )

            /**
             * For each work experience to be placed side by side
             * First Experience left column
             * Second Experience Right column
             * And so on
             */
            if (index %2 ==0){
                column1.push(...mappedDetails)
            } else {
                column2.push(...mappedDetails);
            }
        })

        localWorkHistory.push(
            {
                columns:[
                    column1,
                    column2
                ],
                columnGap:20,
                // margin: [-2,-2,-2,-100]
            }
        )
        this.docDefinition.content.push(localWorkHistory);
    }

    addEducation(educationHistory){
        if (!educationHistory)
            throw Error({message:'Education History is required'});
        
        let localEducationHistory = [];

        localEducationHistory.push(
            {text:'Education',style:['general','header']}
        )
        // Seperatelet Education History in two columns. 
        let column1 = [], column2 = [];
        educationHistory.map((education,index)=>{

            let mappedEducation = [
                {text:'\n'},
                {text:education.Institute,style:['general']},
                {text:`${education.Degree}, Grade: ${education.Grade}`, style:['general','sub-text','description']},
                {text:`${education.From} - ${education.To}`, style:['general','sub-text']},
                {text:'\n'}
            ]

            if (index % 2 === 0){
                column1.push(...mappedEducation)
            } else {
                column2.push(...mappedEducation);
            }
            
        })

        localEducationHistory.push(
            {
                columns:[
                    column1,
                    column2
                ],
                columnGap:20,
                // margin: [-2,-2,-2,-100]
            }
        )

        this.docDefinition.content.push(
            localEducationHistory
        )
    }

    addSkills(bulletedSkills){
        if (!bulletedSkills)
            throw Error({message:" Skills required "})
        let localSkills = [];
        let column = {
            0:{ul:[]},
            1:{ul:[]},
            2:{ul:[]}
        }
        bulletedSkills.map((skill,index)=>{
               column[index%3].ul.push(
                    {text:skill,style:['general']}
                )
        })

        localSkills.push(
            {text:'Skills',style:['general','header']},
            {
             columns:[
                column[0],
                column[1],
                column[2],
            ]
           }
        )
        this.docDefinition.content.push(
            localSkills
        )
        
    }

    addCertificaionAndHonors(bulletedHonors){
        if (!bulletedHonors)
            throw Error({message:"At least 1 Certification/Honor required"})
        let localHonors = [];
        let column = {
            0:{ul:[]},
            1:{ul:[]},
            2:{ul:[]}
        }
        bulletedHonors.map((skill,index)=>{
               column[index%3].ul.push(
                    {text:'\n',listType:'none'},
                    {text:skill,style:['general']}
                )
        })

        localHonors.push(
            {text:'\n\n'},
            {text:'Certificaion And Honors',style:['general','header']},
            {
             columns:[
                column[0],
                column[1],
                column[2],
            ],
            columnGap:20
           }
        )
        this.docDefinition.content.push(
            localHonors
        )
        
    }
    // By default color set and optional param
    setStyles(color = 'blue') {
        this.docDefinition.styles = {
            // Generic formatting to be followed in the whole doc
            general: {
                color: color,
            },
            header: {
                fontSize: 24,
                alignment: 'center',
                bold: true,
                // decoration:'underline',
            },
            'sub-text': {
                fontSize: 10,
                // alignment: 'center',
                // decoration: 'underline',
            },
            'sub-heading':{
                fontSize: 20,
                alignment: 'center',
                bold:true,
            },
            'description':{
                alignment:'justify'
            }
            
        }
    }

    downloadPdf() {
    }

    sendDetails() {
    }

    /**
     * A function to get Resume from the databse and fill the object details
     * 
     */
    getResume() {
    }

    updateResume() {
    }

}

const resume = new Resume({}, {}, {}, {});
// Set the generic styles and also add all the styles for  the resume. 
resume.setStyles();
resume.addHeader("Muhammad Ibrahim", "+92-3212603583", "ibrahimjawedijc@gmail.com", {
    LinkedIn: 'http://linkedin.com/ibrahimijc',
    github:'github.com/ibrahimijc'
})
aboutMe = `A Software Engineer with keen interest in backend architecture development. I take
interest in designing architecture and database models for the applications leveraging
different technologies for solving real world problems.`;

let workHistory = [
    {
        CompanyName:'Zaavya LLC',
        Position:
            {
                Title:'Junior Software Engineer',
                From:'Dec,2019',
                To:'Mar,2020',
                workDescription:[
                    `I made a shopify store for and added services/booking functionality in the shop by integrating shopify applications in the store.`
                    ,`Working on the serverless framework of Smart Data Platform, I re-wrote one of their lambda from python to node.js because of the performances issues we were having in our serverless framework. The purpose of the lambda was to take a json(data) from ElasticCache convert it into gremlin(query) and save it to neptune.`,
                    `I worked on Kibana Dashboard for creating visualization of the serverless system through the logs inserted in ElasticSearch. I visualized how many files were uploaded to the system, how many were successful and, the reason behind it. `
                ]
            }
        ,
        
    },
    {   
        CompanyName:'Zaavya LLC',
        Position:{
            Title:'Software Engineer',
            From:'Mar,2019',
            To:'December,2020',
            workDescription:[
                `I made a shopify store for and added services/booking functionality in the shop by integrating shopify applications in the store.`
                ,`Working on the serverless framework of Smart Data Platform, I re-wrote one of their lambda from python to node.js because of the performances issues we were having in our serverless framework. The purpose of the lambda was to take a json(data) from ElasticCache convert it into gremlin(query) and save it to neptune.`,
                `I worked on Kibana Dashboard for creating visualization of the serverless system through the logs inserted in ElasticSearch. I visualized how many files were uploaded to the system, how many were successful and, the reason behind it. `
            ]
        }
    },
    {
        CompanyName:'Plan Z Creatives',
        Position:
            {
                Title:'Back-End Developer',
                From:'May,2020',
                To:'Present',
                workDescription:[
                `As a backend Engineer my duty is to Design backend Architecture and Modeling Data.`, 
                `Created backend for Vyyral from scratch which is a Dashboard developed for Amazon Sellers using Node.js, MongoDB, lambda, SQS, and bull (Queue based on Redis)`,
                ]
            }
        
        
    }
]

let educationHistory = [
    {
        Institute:"National University of Computer and Emerging Sciences",
        From:"May,2015",
        To:"Dec,2019",
        Degree:"BS, CS",
        Grade:"3.18"
    },
    {
        Institute:"Bahria College",
        From:"May,2013",
        To:"May,2015",
        Degree:"Pre Engineering",
        Grade:"A"
    },
];

let skills = [
    'Node.js',
    'MongoDb',
    'javascript',
    'express',
    'Communication' 
]

let AwardsnHonors = [
    `AWS Cloud Practitioner (2020-2023) Credential ID : JW0G5CT2NBE4QV5Y`,
    `Winner Speed Debugging Competition DevDay19, FAST`,
    `The Complete Course(Udemy)`,
    `DEAN’s list honour Spring 2019`,
    `Runners up at IdeaHatch19 (FYP)`
]
resume.addAbout(aboutMe);

resume.addWorkHistory(workHistory);

resume.addEducation(educationHistory);
resume.addSkills(skills);
resume.addCertificaionAndHonors(AwardsnHonors);
resume.printResume({});



module.exports = Resume;