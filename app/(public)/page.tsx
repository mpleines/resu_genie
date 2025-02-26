'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Dot, SparklesIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import ExampleResume from '/public/example-resume.webp';
import ResumeImageCard from '../components/ResumeImageCard';
import GradientButton from '../components/GradientButton';

export default function Home() {
  return (
    <main className="mx-auto py-16 px-4 flex-1 grid grid-row-1">
      <section className="mx-auto max-w-screen-lg relative flex flex-col items-center justify-center space-y-6 pt-24">
        <div>
          <Badge variant="secondary">
            <Dot className="text-orange-500" />
            Alpha Version
          </Badge>
        </div>
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Your platform for crafting
            <span className="block bg-gradient-to-r from-foreground to-muted-foreground/80 bg-clip-text text-transparent">
              standout resumes.
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Transform your job search with tailored, professional resumes
            crafted by advanced AI. Save time, showcase your skills, and make a
            lasting impression—effortlessly.
          </p>
        </div>
        <GradientButton size="lg" onClick={() => signIn()}>
          <SparklesIcon />
          <span>Create Your Resume</span>
          <ArrowRight className="transition duration-300 ease-in-out" />
        </GradientButton>
      </section>
      <section id="features" className="pt-24 pb-24 max-w-[2400px] mx-auto">
        <div className="grid gap-8 md:grid-cols-3">
          <ResumeImageCard
            imgUrl={ExampleResume.src}
            alt="Minimalistic resume template example"
          />
          <div className="lg:translate-y-8">
            <ResumeImageCard placeholder="Coming soon" />
          </div>
          <ResumeImageCard placeholder="Coming soon" />
        </div>
      </section>
      <section
        id="how-it-works"
        className="max-w-screen-lg mx-auto flex flex-col items-center justify-center mt-8"
      >
        <h1 className="text-5xl md:text-5xl font-bold mb-4">How it works</h1>
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
      <section
        id="faq"
        className="max-w-screen-lg mx-auto flex flex-col items-center justify-center mt-24"
      >
        <h1 className="text-5xl md:text-5xl font-bold mb-4">FAQ</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Is my data secure?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Yes, we value your privacy and ensure the security of your data.
                Your information is protected at all times. We work with
                third-party services like ChatGPT and Supabase to ensure the
                highest level of data safety and security.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>How does the AI work?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We send your information to ChatGPT, a powerful language model,
                to analyze and enhance your resume. This AI-generated content is
                then optimized for ATS platforms and tailored to the job you're
                applying to. We make sure to not generate or inflate any
                information. We believe in keeping your resume authentic and
                honest. We only enhance what you've already written.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>How do I sign up?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                You can sign up by clicking the "Create Your Resume" button
                above or the "Sign In" button in the top right corner. Currently
                we support Google Sign In.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
