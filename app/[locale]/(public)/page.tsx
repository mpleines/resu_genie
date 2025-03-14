'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, SparklesIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import ExampleResume from '/public/example-resume.webp';
import ResumeImageCard from '../../components/ResumeImageCard';
import GradientButton from '../../components/GradientButton';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('landing');

  return (
    <main className="mx-auto py-16 px-4 flex-1 grid grid-row-1">
      <section className="mx-auto max-w-screen-lg relative flex flex-col items-center justify-center space-y-6 pt-24">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            {t('heroNormal')}
            <span className="block bg-gradient-to-r from-foreground to-muted-foreground/80 bg-clip-text text-transparent">
              {t('heroShade')}
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            {t('subhero')}
          </p>
        </div>
        <GradientButton size="lg" onClick={() => signIn()}>
          <SparklesIcon />
          <span>{t('createResume')}</span>
          <ArrowRight className="transition duration-300 ease-in-out" />
        </GradientButton>
      </section>
      <section id="features" className="pt-24 pb-24 max-w-[2400px] mx-auto">
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
        className="max-w-screen-lg mx-auto flex flex-col items-center justify-center mt-8"
      >
        <h1 className="text-5xl md:text-5xl font-bold mb-4">
          {t('howItWorks')}
        </h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('inputDetails.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t('inputDetails.description')}</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('aiOptimization.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('aiOptimization.description')}
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('downloadAndApply.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('downloadAndApply.description')}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
      <section
        id="faq"
        className="max-w-screen-lg mx-auto flex flex-col items-center justify-center mt-24"
      >
        <h1 className="text-5xl md:text-5xl font-bold mb-4">{t('faq')}</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('isDataSecure.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t('isDataSecure.description')}</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('howDoesAiWork.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('howDoesAiWork.description')}
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('howToSignup.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t('howToSignup.description')}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
