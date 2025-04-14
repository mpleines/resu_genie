'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ExampleResume from '/public/example-resume.webp';
import ResumeImageCard from '../../components/ResumeImageCard';
import { useTranslations } from 'next-intl';
import LandingpageButton from '@/app/components/LandingpageButton';
import {
  CheckCircle,
  FileText,
  Shield,
  Sparkles,
  Download,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Home() {
  const t = useTranslations('landing');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.25;
    }
  }, []);

  return (
    <main className="mx-auto flex-1">
      <section className="py-20 px-4">
        <div className="mx-auto max-w-screen-xl relative flex flex-col md:flex-row items-center justify-between gap-8 pt-12">
          <div className="space-y-6 text-center md:text-left md:w-1/2">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                {t('heroNormal')}
                <span className="block bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                  {t('heroShade')}
                </span>
              </h1>
              <p className="mx-auto md:mx-0 max-w-[700px] text-muted-foreground md:text-xl">
                {t('subhero')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <LandingpageButton />
            </div>
          </div>
          <div className="hidden md:block md:w-1/2 relative">
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
              <video
                className="object-cover"
                src="/how-it-works.webm"
                autoPlay
                ref={videoRef}
                loop
                muted
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-4 max-w-screen-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-muted-foreground mx-auto">
            {t('features.description')}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <ResumeImageCard
            imgUrl={ExampleResume.src}
            title={t('templates.minimalistic.title')}
            description={t('templates.minimalistic.description')}
          />
          <div className="lg:translate-y-8">
            <ResumeImageCard
              placeholder="Coming soon"
              title={t('templates.professional.title')}
              description={t('templates.professional.description')}
            />
          </div>
          <ResumeImageCard
            placeholder="Coming soon"
            title={t('templates.comingSoon.title')}
            description={t('templates.comingSoon.description')}
          />
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-24 px-4 bg-teal-50 dark:bg-teal-950/10"
      >
        <div className="max-w-screen-lg mx-auto flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            {t('howItWorks.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl text-center mb-12">
            {t('howItWorks.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-teal-100 dark:border-teal-900 bg-white dark:bg-background shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-xl">
                  {t('inputDetails.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('inputDetails.description')}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-teal-100 dark:border-teal-900 bg-white dark:bg-background shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-xl">
                  {t('aiOptimization.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('aiOptimization.description')}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-teal-100 dark:border-teal-900 bg-white dark:bg-background shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-xl">
                  {t('downloadAndApply.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('downloadAndApply.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 px-4 ">
        <div className="max-w-screen-lg mx-auto flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            {t('faq.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl text-center mb-12">
            {t('faq.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-teal-100 dark:border-teal-900 bg-white dark:bg-background shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-xl">
                  {t('isDataSecure.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('isDataSecure.description')}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-teal-100 dark:border-teal-900 bg-white dark:bg-background shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-xl">
                  {t('howDoesAiWork.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('howDoesAiWork.description')}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-teal-100 dark:border-teal-900 bg-white dark:bg-background shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-xl">
                  {t('howToSignup.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('howToSignup.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-screen-2xl mx-auto bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white space-y-4 md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('readyToLandDreamJob.title')}
              </h2>
              <p className="text-teal-50">
                {t('readyToLandDreamJob.description')}
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <LandingpageButton size="lg" className="bg-white text-black" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
