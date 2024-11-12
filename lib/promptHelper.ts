export const userExampleInputs = {
  name: "Maik Pleines",
  email: "maik.pleines@gmail.com",
  phone_1: "+491599333421",
  address: "Siegelstraße 109",
  city: "Braunschweig",
  website: "https://maikpleines.com",
  professional_experience_in_years: "5",
  highest_education: "Apprenticeship",
  skills: ["React", "Next.js", "Java", "Python", "Django"],
  applied_for_profile: "",
  education: [
    {
      institute_name: "Technical University of Braunschweig",
      year_of_passing: "Not provided",
      score: "",
    },
    {
      institute_name: "Werner-von-Siemens-Schule - BBS Hildesheim",
      year_of_passing: "2019",
      score: "",
    },
  ],
  professional_experiene: [
    {
      organisation_name: "AUEL EDV Beratung GmbH",
      duration: "May 2020 - Present",
      profile:
        "Fullstack Software Developer. Developed a platform for digital management of stocks, Developed a Customer Lifecycle Management system, Involved comprehensively in the entire development process: planning, time estimation, prototyping, programming, and deployment",
    },
    {
      organisation_name: "Cosys Ident GmbH",
      duration: "",
      profile:
        "Software Developer. Developed software solutions in the logistics sector, Provided support for in-house software products",
    },
  ],
};

// for copying into REST tools to test requests
// {
//   "name": "Maik Pleines",
//   "email" : "maik.pleines@gmail.com",
//   "phone_1": "",
//   "address": "Siegfriedstrasse 109",
//   "city": "Braunschweig",
//   "linkedin": "",
//   "website": "https://maikpleines.com",
//   "professional_experience_in_years": "5",
//   "highest_education": "Apprenticeship",
//   "skills": ["React","Next.js", "Java", "Python", "Django"],
//   "applied_for_profile": "",
//   "education": [
//       {
//           "institute_name": "Technical University of Braunschweig",
//           "year_of_passing": "Not provided",
//           "score": ""
//       },
//       {
//           "institute_name": "Werner-von-Siemens-Schule - BBS Hildesheim",
//           "year_of_passing": "2019", // assuming the Bachelor in Information System Engineering was completed around 2019
//           "score": ""
//       }
//   ],
//   "professional_experiene": [
//       {
//           "organisation_name": "AUEL EDV Beratung GmbH",
//           "duration": "May 2020 - Present",
//           "profile": "Fullstack Software Developer. Developed a platform for digital management of stocks, Developed a Customer Lifecycle Management system, Involved comprehensively in the entire development process: planning, time estimation, prototyping, programming, and deployment"
//       },
//       {
//           "organisation_name": "Cosys Ident GmbH",
//           "duration": "",
//           "profile": "Software Developer. Developed software solutions in the logistics sector, Provided support for in-house software products"
//       }
//   ]
// }

export const resumeResponseTemplate = {
  contact_info: {
    name: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    location: "Location (City, State)",
  },
  summary: "A concise professional summary tailored to the job description.",
  skills: ["List of relevant skills based on job description and resume data"],
  education: [
    {
      degree: "Degree",
      institution: "Institution Name",
      year_of_completion: "Year",
      location: "City, State",
    },
  ],
  work_experience: [
    {
      job_title: "Job Title",
      company: "Company Name",
      start_date: "Start Date",
      end_date: "End Date or 'Present'",
      location: "City, State",
      responsibilities: ["Responsibility 1", "Responsibility 2"],
      achievements: ["Achievement 1", "Achievement 2"],
    },
  ],
  improvement_tips: [
    "List any tips for improving the resume, including any missing information or areas that could be strengthened.",
  ],
};

export const createResumePrompt = (
  jobAdvertisement: string,
  resumeData: string
) => `
  You will generate a resume based on the following job description and applicant resume data.

  Job Description:
  ${jobAdvertisement}

  Resume Data:
  ${resumeData}

  Instructions:
  1. Analyze the job description and resume data carefully.
  2. Use the data provided to fill in each section: Contact Information, Summary, Skills, Education, and Work Experience.
  3. If a relevant detail for a section is missing, infer reasonable content from the context without introducing new qualifications, skills, or education that the applicant has not mentioned.
  4. Ensure the resume is optimized for Application Tracking Systems (ATS), using keywords from the job description when appropriate.
  5. Do not exaggerate or invent qualifications. Stick closely to the applicant's resume data.
  6. Format the output as a valid JSON string with the following structure:

  ${resumeResponseTemplate}

  7. Ensure all keys in the JSON template are filled, and only output the filled JSON structure.
  8. Provide tips for improvement in the "improvement_tips" section. If something critical is missing, such as a major skill or job detail, flag it in the tips.
  9. If calculating dates or durations, ensure the correct year is {datetime.datetime.now().year}.
`;

const fullSamplePrompt = `
  You will generate a resume based on the following job description and applicant resume data.

  Job Description:
  
  About Us:
  At [Your Company Name], we are a fast-growing tech company dedicated to building innovative solutions that empower businesses to succeed. Our team is passionate about technology and committed to creating a dynamic, inclusive workplace where everyone can thrive. We are currently seeking a Senior Fullstack Engineer with expertise in React and Python to join our talented engineering team.

  Job Description:
  As a Senior Fullstack Engineer, you will play a key role in designing, developing, and maintaining our web applications. You will work closely with cross-functional teams, including product managers, designers, and other engineers, to deliver high-quality, scalable solutions. This role requires a deep understanding of both frontend and backend technologies, with a focus on React and Python.

  Key Responsibilities:

  Design and develop robust, scalable web applications using React (frontend) and Python (backend).
  Collaborate with product managers and designers to define and implement new features.
  Write clean, maintainable, and well-documented code.
  Ensure the performance, quality, and responsiveness of applications.
  Mentor and provide guidance to junior engineers, promoting best practices and coding standards.
  Participate in code reviews, providing constructive feedback to peers.
  Stay up-to-date with emerging technologies and industry trends.
  Requirements:

  Bachelor's degree in Computer Science, Engineering, or a related field, or equivalent practical experience.
  5+ years of experience in fullstack development, with a strong focus on React and Python.
  Proficiency in frontend technologies including HTML, CSS, JavaScript, and modern frameworks like React.
  Strong experience with Python and backend frameworks such as Django or Flask.
  Familiarity with RESTful APIs, database design, and SQL.
  Experience with version control systems like Git.
  Excellent problem-solving skills and a proactive attitude.
  Strong communication skills, with the ability to work effectively in a team environment.

  Resume Data:
  {
    "name": "Maik Pleines",
    "email" : "maik.pleines@gmail.com",
    "phone_1": "",
    "address": "Siegfriedstrasse 109",
    "city": "Braunschweig",
    "linkedin": "",
    "website": "https://maikpleines.com",
    "professional_experience_in_years": "5",
    "highest_education": "Apprenticeship",
    "skills": ["React","Next.js", "Java", "Python", "Django"],
    "applied_for_profile": "",
    "education": [
        {
            "institute_name": "Technical University of Braunschweig",
            "year_of_passing": "Not provided",
            "score": ""
        },
        {
            "institute_name": "Werner-von-Siemens-Schule - BBS Hildesheim",
            "year_of_passing": "2019", // assuming the Bachelor in Information System Engineering was completed around 2019
            "score": ""
        }
    ],
    "professional_experiene": [
        {
            "organisation_name": "AUEL EDV Beratung GmbH",
            "duration": "May 2020 - Present",
            "profile": "Fullstack Software Developer. Developed a platform for digital management of stocks, Developed a Customer Lifecycle Management system, Involved comprehensively in the entire development process: planning, time estimation, prototyping, programming, and deployment"
        },
        {
            "organisation_name": "Cosys Ident GmbH",
            "duration": "",
            "profile": "Software Developer. Developed software solutions in the logistics sector, Provided support for in-house software products"
        }
    ]
  }

  Instructions:
  1. Analyze the job description and resume data carefully.
  2. Use the data provided to fill in each section: Contact Information, Summary, Skills, Education, and Work Experience.
  3. If a relevant detail for a section is missing, infer reasonable content from the context without introducing new qualifications, skills, or education that the applicant has not mentioned.
  4. Ensure the resume is optimized for Application Tracking Systems (ATS), using keywords from the job description when appropriate.
  5. Do not exaggerate or invent qualifications. Stick closely to the applicant's resume data.
  6. Format the output as a valid JSON string with the following structure:

  {
    "contact_info": {
      "name": "Full Name",
      "phone": "Phone Number",
      "email": "Email Address",
      "location": "Location (City, State)",
    },
    "summary": "A concise professional summary tailored to the job description.",
    "skills": ["List of relevant skills based on job description and resume data"],
    "education": [
      {
        "degree": "Degree",
        "institution": "Institution Name",
        "year_of_completion": "Year",
        "location": "City, State",
      },
    ],
    "work_experience": [
      {
        "job_title": "Job Title",
        "company": "Company Name",
        "start_date": "Start Date",
        "end_date": "End Date or 'Present'",
        "location": "City, State",
        "responsibilities": ["Responsibility 1", "Responsibility 2"],
        "achievements": ["Achievement 1", "Achievement 2"],
      },
    ],
    "improvement_tips": [
      "List any tips for improving the resume, including any missing information or areas that could be strengthened.",
    ],
  }

  7. Ensure all keys in the JSON template are filled, and only output the filled JSON structure.
  8. Provide tips for improvement in the "improvement_tips" section. If something critical is missing, such as a major skill or job detail, flag it in the tips.
  9. If calculating dates or durations, ensure the correct year is {datetime.datetime.now().year}.
`;
