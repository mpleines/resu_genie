export type ResumeData = {
  personal_information: {
    name: string;
    email: string;
    phone_1: string;
    address: string;
    city: string;
    professional_experience_in_years: number;
  };
  skills: string[];
  job_advertisement: string;
  education: { institute_name: string; start_date: string; end_date: string }[];
  work_experience: {
    organisation_name: string;
    start_date: string;
    end_date: string;
    profile: string;
  }[];
};

export type ResumeResponse = ResumeData & {
  improvement_tips: string[];
  summary: string;
};

export const resumeResponseTemplate: ResumeResponse = {
  job_advertisement: 'Job description',
  summary: 'A concise professional summary tailored to the job description.',
  personal_information: {
    name: 'Full Name',
    phone_1: 'Phone Number',
    email: 'Email Address',
    address: 'Address',
    city: 'City',
    professional_experience_in_years: 0,
  },
  skills: ['List of relevant skills based on job description and resume data'],
  education: [
    {
      institute_name: 'Institution Name',
      start_date: 'Start Date',
      end_date: 'End Date',
    },
  ],
  work_experience: [
    {
      profile: 'Job Title',
      organisation_name: 'Company Name',
      start_date: 'Start Date',
      end_date: 'End Date',
    },
  ],
  improvement_tips: [
    'List any tips for improving the resume, including any missing information or areas that could be strengthened.',
  ],
};

export const createResumePrompt = (resumePromptData: ResumeData) => `
  You will generate a resume based on the following job description and applicant resume data.

  Job Description:
  ${resumePromptData.job_advertisement}

  Resume Data:
  ${JSON.stringify({ ...resumePromptData, job_advertisement: undefined })}

  Instructions:
  1. Analyze the job description and resume data carefully.
  2. Use the data provided to fill in each section: Personal Information, Summary, Skills, Education, and Work Experience.
  3. If a relevant detail for a section is missing, infer reasonable content from the context without introducing new qualifications, skills, or education that the applicant has not mentioned.
  4. Ensure the resume is optimized for Application Tracking Systems (ATS), using keywords from the job description when appropriate.
  5. Do not exaggerate or invent qualifications. Stick closely to the applicant's resume data.
  6. Format the output as a valid JSON object. Do not return markdown, just the JSON object itself with the following structure:

  ${resumeResponseTemplate}

  7. Ensure all keys in the JSON template are filled, and only output the filled JSON structure.
  8. Provide tips for improvement in the "improvement_tips" section. If something critical is missing, such as a major skill or job detail, flag it in the tips.
  9. If calculating dates or durations, ensure the correct year is {datetime.datetime.now().year}.
`;
