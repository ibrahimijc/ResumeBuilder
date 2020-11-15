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

    constructor(params) {
        const {
            Name, Email,  Contact, educationHistory, workHistory,selfDescription, skills, AwardsnHonors, Social
        } = params
        this.Email = Email;
        this.Name = Name;
        this.Contact = Contact;
        this.educationHistory = educationHistory;
        this.workHistory = workHistory;
        this.skills = skills;
        this.selfDescription = selfDescription;
        this.AwardsnHonors = AwardsnHonors;
        this.Social = Social

        // This is the main document builder through which we will built whole pdf.
        this.docDefinition = {
            content: [
            ],
            styles: {
            }
        };
    }
    // Saves Resume to local file system
    printResume(includingSectionsWithPriority) {
        // console.log(JSON.stringify(this.docDefinition, null, ' '));
        const pdfDoc = printer.createPdfKitDocument(this.docDefinition, {});
        pdfDoc.pipe(fs.createWriteStream('name'));
        pdfDoc.end();
    }

    // Adds peronal details and social links
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
           Social.map(value=>{
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

    // Comparer for the sub-headings to be inserted in length wise order bigger to smaller
    compareText( a, b ) {
        if ( a.text.length < b.text.length ){
          return 1;
        }
        if ( a.text.length > b.text.length ){
          return -1;
        }
        return 0;
      }
    
    // Adds Introduction
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
        // Fill the original object
        this.docDefinition.content.push(localWorkHistory);
    }

    addEducation(educationHistory){
        if (!educationHistory)
            throw Error({message:'Education History is required'});
        
        let localEducationHistory = [];

        localEducationHistory.push(
            {text:'\n'},
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
               // Having three columns, push in each linewise
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

    // Certification and Honors Section
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
    // For sending pdf doc to client
    async createPdfBinary(pdfDocs, callback) {
        const pdfDoc = this.docDefinition;
        // console.log(this.docDefinition);
        return new Promise((resolve,reject)=>{
        
            let printer = new PdfPrinter(fonts);
        
            let doc = printer.createPdfKitDocument(pdfDoc);
        
            let chunks = [];
            let result;
            
            doc.on('data', function (chunk) {
                chunks.push(chunk);
            });
            doc.on('end', function () {
                result = Buffer.concat(chunks);
                resolve(result)
            });
            doc.end();
        })
       
    
    }

    // For dynamically setting the content in the pdf
    setContentWithPreference(givenPreference){
        let modifiedPreference = [];

        let allowedPreference = [
            'About',
            'Education',
            'Work',
            'Skills',
            'Certificate'
        ]

        // simplifying the name for the client
        if (givenPreference)
        givenPreference.map(value=>{
            // Reject the Wrong Preference
            if (!allowedPreference.includes(value))
                throw Error('Wrong Preference and Header is by Default');
            // Map simple values to function names
            let mapToFunctionName = {
                // 'Header':'addHeader',
                'About': 'addAbout',
                'Education': 'addEducation',
                'Work': 'addWorkHistory',
                'Skills': 'addSkills',
                "Certificate":'addCertificaionAndHonors'
            }
            modifiedPreference.push(mapToFunctionName[value]);
        })

        // Header is must for all, If preference is give, replace it with modified else use default
          let  preference  = givenPreference ? modifiedPreference : [
                'addAbout',
                'addEducation',
                'addWorkHistory',
                'addSkills',
                'addCertificaionAndHonors'
            ];
        // Header is by default
        this.addHeader(this.Name,this.Contact,this.Email,this.Social);
        preference.map((section)=>{
            // Call a function with their params
            let result =  this.getParams(section);
            this[section](...result)
        })
    }

    /**
     * A function to get Resume from the databse and fill the object details
     * 
     */
    getResume() {
        return this;
    }

    // Returns the parameters for dynamic function calls
    getParams(section){

       const sectionParam = {
            'addHeader' : [this.Name,this.Contact,this.Email,this.Social],
            'addEducation':[this.educationHistory],
            'addWorkHistory':[this.workHistory],
            'addSkills':[this.skills],
            'addAbout':[this.selfDescription],
            'addCertificaionAndHonors':[this.AwardsnHonors]
        }
        return sectionParam[section]
    }

}



module.exports = Resume;