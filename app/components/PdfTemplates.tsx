import { ResumeResponse } from '@/lib/promptHelper';
import { format } from 'date-fns';
import { forwardRef } from 'react';

type TemplateProps = {
  data: ResumeResponse;
  contactInfo: string;
};

export const MinimalisticResumeTemplate = forwardRef<
  HTMLDivElement,
  TemplateProps
>((props, ref) => {
  const {
    data: { personal_information, work_experience, summary, skills, education },
    contactInfo,
  } = props;

  return (
    <div ref={ref} {...props}>
      <div
        className="p-6 mx-auto font-serif text-xl"
        style={{ fontFamily: 'Times New Roman' }}
      >
        <header className="mt-8 mb-8 text-center">
          <h1 className="text-2xl font-bold">{personal_information?.name}</h1>
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
  );
});

MinimalisticResumeTemplate.displayName = 'MinimalisticResumeTemplate';
