# ResumeBuilder
 
 JSON Structure for POST /completeresume endpoint: 
 
 
    {    
        "Email": "email@gmail.com",
        "Name": "Ibrahim",
        "workHistory": [
          {
              "CompanyName":"Some Company",
              "Position":
                {
                    "Title":"Software Engineer",
                    "From":"Dec,2019",
                    "To":"Mar,2020",
                    "workDescription":[
                        "I lorem ipsum."
                        ,"Lorem Ipsum",
                        "I Lorem Ipsum
                    ]
                }
            
        },
        {   
            "CompanyName":"ABC LLC",
            "Position":{
                "Title":"Test Engineer",
                "From":"Mar,2019",
                "To":"December,2020",
                "workDescription":[
                    "I Something."
                    ,"Yes",
                    "I Did point 3 "
                ]
            }
        },
        {
            "CompanyName":"Creativity",
            "Position":
                {
                    "Title":"Developer",
                    "From":"May,2020",
                    "To":"Present",
                    "workDescription":[
                    "I achieved some stuff here.", 
                    "I'm responsible for everything"
                    ]
                }
            
            
        }
    ],
    "educationHistory": [
        {
            "Institute":"Some Science University",
            "From":"May,2015",
            "To":"Dec,2019",
            "Degree":"BS, CS",
            "Grade":"3.18"
        },
        {
            "Institute":"Some College",
            "From":"May,2013",
            "To":"May,2015",
            "Degree":"Pre Engineering",
            "Grade":"A"
        }
    ],
    "selfDescription": "A Software Engineer with keen interest in backend architecture development. I take interest in designing architecture and database models for the applications leveraging different technologies for solving real world problems.",
    "Contact": "+92-3213450943",
    "skills": [
        "Node.js",
        "MongoDb",
        "javascript",
        "express",
        "Communication" 
    ],
    "AwardsnHonors":[
    "AWS Cloud Practitioner (2020-2023) Credential ID : JW0G5CT2NBE4QV5Y",
    "Winner Speed Debugging Competition DevDay19, FAST",
    "The Complete Course(Udemy)",
    "DEAN’s list honour Spring 2019",
    "Runners up at IdeaHatch19 (FYP)"
    ]}
