'use client';

import { Button } from '@/components/ui/button';
import { ResumeResponse } from '@/lib/promptHelper';
import { createClient } from '@/lib/supabase/client';
import { useScrollToTop } from '@/lib/useScrollToTop';
import { format } from 'date-fns';
import { DownloadIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function Page() {
  const supabase = createClient();
  const [optimizedResume, setOptimizedResume] = useState<ResumeResponse>();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const params = useParams();
  const resumeId = Number(params['resumeId'] as string);

  useScrollToTop();

  const getOptimizedResumeData = useCallback(async () => {
    const { data } = await supabase
      .from('resume')
      .select()
      .eq('id', resumeId)
      .single();

    if (data?.chat_gpt_response_raw == null) {
      return;
    }

    // FIXME: handle possible errors
    const resumeData = data?.chat_gpt_response_raw as ResumeResponse;
    setOptimizedResume(resumeData);
  }, [resumeId, supabase]);

  async function handleDownload() {
    reactToPrintFn();
  }

  useEffect(() => {
    getOptimizedResumeData();
  }, [getOptimizedResumeData]);

  const { personal_information, work_experience, education, skills, summary } =
    optimizedResume ?? {};

  return (
    <div className="flex flex-col items-center">
      <div>
        <Button onClick={handleDownload}>
          <DownloadIcon />
          Download
        </Button>
      </div>
      <div className="mt-4 w-full">
        <div className="bg-white shadow-md rounded-md w-full h-auto md:w-[210mm] md:h-[297mm] mx-auto border border-gray-300">
          <div ref={contentRef}>
            <div
              className="p-6 mx-auto font-serif text-xl"
              style={{ fontFamily: 'Times New Roman' }}
            >
              <header className="mt-8 mb-8 text-center">
                <h1 className="text-4xl font-bold">
                  {personal_information?.name}
                </h1>
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
                      {/* <ul className="mt-2 list-disc list-inside text-gray-700">
                        {job.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul> */}
                    </li>
                  ))}
                </ul>
              </section>
              {/* <section className="mb-8">
                <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
                  Projects
                </h2>
                <ul>
                  {projects.map((project, index) => (
                    <li key={index} className="mb-6">
                      <h3 className="text-xl font-medium">{project.name}</h3>
                      <p className="text-sm  mb-2">
                        Stack: {project.stack}
                      </p>
                      <ul className="list-disc list-inside text-gray-700">
                        {project.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </section> */}
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
      </div>
    </div>
  );
}
