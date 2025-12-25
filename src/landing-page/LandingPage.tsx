import React, { useRef } from 'react';
import HeroSection from '@/landing-page/components/HeroSection';
import FeaturesSection from '@/landing-page/components/FeaturesSection';
import FormSection from '@/landing-page/components/FormSection';
import Footer from '@/landing-page/components/Footer';

const LandingPage: React.FC = () => {
  const formSectionRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection onCtaClick={scrollToForm} />

      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Form Section */}
      <div id="cadastro" ref={formSectionRef}>
        <FormSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

