'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Hero } from '@/components/landing/Hero';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { PricingSection } from '@/components/landing/PricingSection';
import { FaqAccordion } from '@/components/landing/FaqAccordion';
import { CallToAction } from '@/components/landing/CallToAction';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <>
      <AppLayout>
        <Hero />
        <FeatureShowcase />
        <PricingSection />
        <FaqAccordion />
        <CallToAction />
      </AppLayout>
      <Footer />
    </>
  );
}
