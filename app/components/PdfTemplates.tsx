import { ResumeResponse } from '@/lib/promptHelper';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Mail, MapPin, Phone } from 'lucide-react';
import { forwardRef } from 'react';

type TemplateProps = {
  data: ResumeResponse;
  email: string;
  isDINA4?: boolean;
};

function getContainerClass(isDINA4?: boolean) {
  return isDINA4
    ? 'w-[210mm] h-[297mm] [font-size: 12px]'
    : 'w-full h-auto max-w-[210mm] max-h-[297mm] [font-size:_clamp(12px,5vw,16px)]';
}

export const MinimalisticResumeTemplate = forwardRef<
  HTMLDivElement,
  TemplateProps
>((props, ref) => {
  const {
    data: { personal_information, work_experience, summary, skills, education },
    email,
    isDINA4,
  } = props;

  const contactInfo = [
    personal_information?.address,
    personal_information?.phone_1,
    email,
  ]
    .filter(Boolean)
    .join(' | ');

  const containerClass = getContainerClass(isDINA4);

  return (
    <div
      className={cn(
        'bg-white shadow-md rounded-md border border-gray-300 text-sm',
        containerClass
      )}
    >
      <div ref={ref}>
        <div
          className="p-6 mx-auto font-serif"
          style={{ fontFamily: 'Times New Roman' }}
        >
          <header className="mt-8 mb-8 text-center">
            <h1 className="text-xl font-bold">{personal_information?.name}</h1>
            <span>{contactInfo}</span>
          </header>
          <section>
            {summary && (
              <div className="mb-8">
                <h2 className="font-bold border-b border-black pb-2 mb-4 text-center">
                  Summary
                </h2>
                <p>{summary}</p>
              </div>
            )}
          </section>
          <section className="mb-8">
            <h2 className="font-bold border-b border-black pb-2 mb-4 text-center">
              Experience
            </h2>
            <ul>
              {work_experience?.map((job, index) => (
                <li key={index} className="mb-6">
                  <h3 className="font-bold">{job.organisation_name}</h3>
                  <div className="flex justify-between">
                    <p className="italic">{job.profile}</p>
                    <p>
                      {format(new Date(job.start_date), 'MMMM yyyy')} -{' '}
                      {format(new Date(job.end_date), 'MMMM yyyy')}
                    </p>
                  </div>
                  <ul className="mt-2 list-disc list-inside text-gray-700">
                    {job.job_description?.map((detail, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span style={{ flexShrink: 0, marginRight: '0.5em' }}>
                          &bull;
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="font-bold border-b border-black pb-2 mb-4 text-center">
              Skills
            </h2>
            <p>{skills?.join(', ')}</p>
          </section>
          <section>
            <h2 className="font font-bold border-b border-black pb-2 mb-4 text-center">
              Education
            </h2>
            <ul>
              {education?.map((edu, index) => (
                <li key={index} className="mb-6">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{edu.institute_name}</h3>
                    <p>
                      {format(new Date(edu.start_date), 'MMMM yyyy')} -{' '}
                      {format(new Date(edu.end_date), 'MMMM yyyy')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
});

MinimalisticResumeTemplate.displayName = 'MinimalisticResumeTemplate';

export const ProfessionalResumeTemplate = forwardRef<
  HTMLDivElement,
  TemplateProps
>((props, ref) => {
  const {
    data: { personal_information, work_experience, summary, skills, education },
    email,
    isDINA4,
  } = props;

  const containerClass = getContainerClass(isDINA4);

  return (
    <div
      className={cn(
        'bg-white shadow-md rounded-md w-full h-auto mx-auto border border-gray-300',
        containerClass
      )}
    >
      <div ref={ref}>
        <div className="mx-auto p-6 bg-white text-gray-800">
          <header className="mb-8 border-b-2 border-gray-300 pb-4">
            <h1 className="text-xl font-bold mb-2">
              {personal_information.name}
            </h1>
            <div className="flex flex-wrap gap-4">
              {email && (
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{email}</span>
                </div>
              )}
              {personal_information.phone_1 && (
                <div className="flex items-center gap-1">
                  <Phone size={16} />
                  <span>{personal_information.phone_1}</span>
                </div>
              )}
              {personal_information.address && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{personal_information.address}</span>
                </div>
              )}
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <p className="text-gray-700">{summary}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            <div className="mb-6 space-y-4">
              {work_experience?.map((job, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold">
                    {job.organisation_name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {job.profile}
                    <span>
                      {' ('}
                      {format(new Date(job.start_date), 'MMMM yyyy')} -{' '}
                      {format(new Date(job.end_date), 'MMMM yyyy')}
                      {')'}
                    </span>
                  </p>
                  <ul className="list-disc list-inside text-gray-700">
                    {job.job_description?.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold">
                    {edu.institute_name}
                  </h3>
                  <p className="text-gray-400 mb-2">
                    {format(new Date(edu.start_date), 'MMMM yyyy')} -{' '}
                    {format(new Date(edu.end_date), 'MMMM yyyy')}
                  </p>
                  <p className="text-gray-700">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
});

ProfessionalResumeTemplate.displayName = 'ProfessionalResumeTemplate';

const ModernCreativeResume = forwardRef<HTMLDivElement, TemplateProps>(
  (props, ref) => {
    const {
      data: {
        personal_information,
        work_experience,
        summary,
        skills,
        education,
      },
      email,
      isDINA4,
    } = props;

    const containerClass = getContainerClass(isDINA4);

    return (
      <div
        className={cn(
          'bg-white shadow-md rounded-md h-auto mx-auto border border-gray-300',
          containerClass
        )}
      >
        <div ref={ref}>
          <div className="mx-auto p-6 bg-white text-gray-800">
            <header className="mb-8 relative">
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h1 className="text-xl text-blue-600 font-extrabold mb-2 tracking-tight">
                    {personal_information.name}
                  </h1>
                  <p className="text-blue-600 font-light mb-4">
                    Senior Software Engineer
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 justify-end">
                      <span>{email}</span>
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    {personal_information.phone_1 && (
                      <div className="flex items-center gap-2 justify-end">
                        <span>{personal_information.phone_1}</span>
                        <Phone size={18} className="text-blue-600" />
                      </div>
                    )}
                    {personal_information.address && (
                      <div className="flex items-center gap-2 justify-end">
                        <span>{personal_information.address}</span>
                        <MapPin size={18} className="text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-blue-600">Summary</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{summary}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-blue-600">
                Experience
              </h2>
              <div className="mb-6 relative pl-8 border-l-2 border-blue-200 space-y-2">
                {work_experience.map((experience) => (
                  <div key={experience.organisation_name}>
                    <div className="absolute w-4 h-4 bg-blue-600 rounded-full left-[-9px] top-1"></div>
                    <h3 className="text-xl font-bold">
                      {experience.organisation_name}{' '}
                    </h3>
                    <p className="text-gray-600 mb-2 font-semibold">
                      {experience.profile} (
                      {format(new Date(experience.start_date), 'MMMM yyyy')} -{' '}
                      {experience.end_date
                        ? format(new Date(experience.end_date), 'MMMM yyyy')
                        : 'Present'}
                      )
                    </p>

                    <ul className="list-none text-gray-700">
                      {experience.job_description?.map((description) => (
                        <li key={description}>{description}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-blue-600">
                Education
              </h2>
              <div className="pl-8 relative border-l-2 border-blue-200">
                {education.map((edu) => (
                  <div key={edu.institute_name}>
                    <div className="absolute w-4 h-4 bg-blue-600 rounded-full left-[-9px] top-1"></div>
                    <h3 className="text-xl font-bold">{edu.degree}</h3>
                    <p className="text-gray-600 font-semibold">
                      {edu.institute_name}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 text-blue-600">Skills</h2>
              <ul className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="bg-blue-100 px-4 py-2 rounded-full text-blue-800 font-semibold text-sm border border-blue-300 hover:bg-blue-200 transition-colors duration-200"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
  }
);

ModernCreativeResume.displayName = 'ModernCreativeResume';

export default ModernCreativeResume;
