'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <main className="py-16 px-6 flex-1">
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-bold text-indigo-500 mb-4">
          Launch Your Career
        </h1>
        <p className="text-xl mb-4">
          Create a stellar resume in minutes with our AI-powered cosmic resume
          builder
        </p>

        <Button
          className="font-semibold bg-indigo-500 hover:bg-indigo-600"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          Create Your Resume
        </Button>
      </section>
      <section className="flex flex-col items-center justify-center mt-24">
        <h1 className="text-5xl md:text-5xl font-bold text-indigo-500 mb-4">
          How it works
        </h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Input Your Details</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enter your professional information and experience with our
                user-friendly interface.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our advanced AI analyzes and enhances your resume content for
                maximum impact.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Download & Apply</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get your polished, ATS optimized, professional resume instantly
                and start applying to jobs.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center mt-24">
        <h1 className="text-5xl md:text-5xl font-bold text-indigo-500 mb-4">
          Pricing
        </h1>
      </section>
    </main>
  );
}
