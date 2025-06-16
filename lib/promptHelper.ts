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
  education: {
    institute_name: string;
    degree?: string;
    start_date: string;
    end_date: string;
  }[];
  work_experience: {
    organisation_name: string;
    job_description?: string;
    start_date: string;
    end_date: string;
    profile: string;
  }[];
};

export type ResumeResponse = Omit<ResumeData, "work_experience"> & {
  work_experience: {
    organisation_name: string;
    job_description?: string[];
    start_date: string;
    end_date: string;
    profile: string;
  }[];
  improvement_tips: string[];
  summary: string;
};
