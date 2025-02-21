import { Database } from './supabase';

export type JobAdvertisement =
  Database['public']['Tables']['job_advertisement']['Row'];
export type PersonalInformation =
  Database['public']['Tables']['personal_information']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type Resume = Database['public']['Tables']['resume']['Row'];
export type WorkExperience =
  Database['public']['Tables']['work_experience']['Row'];
export type Education = Database['public']['Tables']['education']['Row'];

export type Summary = {
  job_advertisement: {
    text: string;
  };
  personal_information: {
    city: string;
    name: string;
    address: string;
    phone_1: string;
    professional_experience_in_years: number;
  };
  skills: {
    skill_name: string;
  }[];
  work_experience: {
    profile: string;
    end_date: string;
    start_date: string;
    job_description: string;
    organisation_name: string;
  }[];
  education: {
    degree: string;
    end_date: string;
    start_date: string;
    institute_name: string;
  }[];
};
