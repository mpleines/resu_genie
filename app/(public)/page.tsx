'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dot, FileIcon, SparklesIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import ExampleResume from '/public/example-resume.webp';

export default function Home() {
  return (
    <main className="mx-auto py-16 px-4 flex-1 grid grid-row-1">
      <section className="mx-auto max-w-screen-lg relative pt-24 pb-48 flex flex-col items-center justify-center space-y-6">
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
        <Button
          size="lg"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          <SparklesIcon />
          Create Your Resume
        </Button>
      </section>
      <section id="features" className="lg:px-24 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="group relative">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/50 to-primary blur-lg transition-all group-hover:blur-xl" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border shadow-xl">
              <Image
                src={ExampleResume}
                alt="Minimalistic resume template example"
                width={600}
                height={800}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="absolute bottom-6 left-6">
                  <Badge className="mb-2 gap-1">
                    <FileIcon className="h-3 w-3" />
                    Minimalistic Template
                  </Badge>
                  <p className="text-sm text-white">
                    For those who prefer a clean and simple design.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative translate-y-8">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/50 to-primary blur-lg transition-all group-hover:blur-xl" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border bg-card shadow-xl">
              <div className="h-full flex justify-center items-center text-muted-foreground font-bold">
                Coming soon
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="absolute bottom-6 left-6">
                  <Badge className="mb-2 gap-1">
                    <FileIcon className="h-3 w-3" />
                    Professional Template
                  </Badge>
                  <p className="text-sm text-white">For executive positions</p>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/50 to-primary blur-lg transition-all group-hover:blur-xl" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border bg-card shadow-xl">
              <div className="h-full flex justify-center items-center text-muted-foreground font-bold">
                Coming soon
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="absolute bottom-6 left-6">
                  <Badge className="mb-2 gap-1">
                    <FileIcon className="h-3 w-3" />
                    Creative Template
                  </Badge>
                  <p className="text-sm text-white">
                    Stand out in creative fields
                  </p>
                </div>
              </div>
            </div>
          </div>
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
