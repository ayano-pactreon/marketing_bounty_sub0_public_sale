'use client'
import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Image from "next/image";
import {useTranslations} from "next-intl";

const Technology = () => {
  const { isDark } = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const tTechnology = useTranslations('technology');
  const tCommon = useTranslations('common');

  // Function to handle smooth scroll to hero section
  const scrollToHero = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const heroElement = document.getElementById('hero') || document.querySelector('section');
    if (heroElement) {
      heroElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };


  const techStack = [
    {
      icon: "/images/Group 3.png",
      title: tTechnology('stack.aiAgent.title'),
      description: tTechnology('stack.aiAgent.description'),
      features: [
        tTechnology('stack.aiAgent.features.nlp'),
        tTechnology('stack.aiAgent.features.automation'),
        tTechnology('stack.aiAgent.features.smartContracts')
      ],
      link: tTechnology('stack.aiAgent.link')
    },
    {
      icon: "/images/Group 2.png",
      title: tTechnology('stack.mandalaId.title'),
      description: tTechnology('stack.mandalaId.description'),
      features: [
        tTechnology('stack.mandalaId.features.zkProofs'),
        tTechnology('stack.mandalaId.features.biometric'),
        tTechnology('stack.mandalaId.features.crossChain')
      ],
      link: tTechnology('stack.mandalaId.link')
    },
    {
      icon: "/images/shield-icon.png",
      title: tTechnology('stack.zkml.title'),
      description: tTechnology('stack.zkml.description'),
      features: [
        tTechnology('stack.zkml.features.privacy'),
        tTechnology('stack.zkml.features.verifiable'),
        tTechnology('stack.zkml.features.scalable')
      ],
      link: tTechnology('stack.zkml.link')
    },
    {
      icon: "/images/Group 5.png",
      title: tTechnology('stack.sovereign.title'),
      description: tTechnology('stack.sovereign.description'),
      features: [
        tTechnology('stack.sovereign.features.compliance'),
        tTechnology('stack.sovereign.features.governance'),
        tTechnology('stack.sovereign.features.deployment')
      ],
      link: tTechnology('stack.sovereign.link')
    }
  ];

  const flowSteps = [
    {
      title: tTechnology('aiFlow.step1.title'),
      description: tTechnology('aiFlow.step1.description')
    },
    {
      title: tTechnology('aiFlow.step2.title'),
      description: tTechnology('aiFlow.step2.description')
    },
    {
      title: tTechnology('aiFlow.step3.title'),
      description: tTechnology('aiFlow.step3.description')
    },
    {
      title: tTechnology('aiFlow.step4.title'),
      description: tTechnology('aiFlow.step4.description')
    }
  ];

  return (
    <section id="technology" ref={sectionRef} className="py-20 relative overflow-hidden">
      {
        tCommon('elementToggle') === 'true' && (
              <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-[url('/images/04.png')] bg-no-repeat"
                    style={{
                      backgroundSize: 'min(100%, 1800px)',
                      backgroundPosition: 'center calc(20% - 200px)'
                    }}
                ></div>
              </div>
          )
      }
      <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-slate-100">{tTechnology('title.part1')}</span>
            <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#a855f7] bg-clip-text text-transparent">
              {tTechnology('title.part2')}
            </span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-slate-200/80">
            {tTechnology('description')}
          </p>
        </div>

        {/* Technology Stack */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {techStack.map((tech, index) => (
            <div 
              key={index} 
              className="group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div 
                className={`glass-panel rounded-2xl p-4 h-full transition-all duration-300 hover:border-purple-400/40 hover:-translate-y-2 ${
                  tech.link ? 'cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (tech.link && tech.link.trim()) {
                    window.open(tech.link, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg drop-shadow-purple-500">
                  {/*{tech.icon}*/}
                  <Image src={tech.icon} alt="icon" width={32} height={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-50">
                  {tech.title}
                </h3>
                <p className="mb-4 leading-relaxed text-slate-200/80">
                  {tech.description}
                </p>
                <div className="space-y-2">
                  {tech.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm gap-2 text-slate-200">
                      {/*<CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />*/}
                      <Image src="/images/Group 6.png" alt="icon" width={16} height={16} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Flow Visualization */}
        <div className="rounded-3xl p-8 glass-panel border border-white/10" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-2xl font-bold mb-8 text-center text-slate-50">
            {tTechnology('aiFlow.title')}
          </h3>

          <div className="relative">
            <div className="flex flex-col md:flex-row items-stretch justify-between space-y-8 md:space-y-0 md:space-x-4">
              {flowSteps.map((step, index) => (
                <div key={index} className="flex-1 relative">
                  <div 
                    className={`border-2 rounded-2xl p-6 text-center transition-all duration-500 cursor-pointer h-full flex flex-col justify-center min-h-[200px] ${
                      activeStep === index 
                        ? 'border-purple-400 transform scale-105 bg-purple-500/10 shadow-purple-500/20 shadow-xl' 
                        : 'bg-white/5 border-white/10 hover:border-purple-300/80'
                    }`}
                    onMouseEnter={() => setActiveStep(index)}
                  >
                    <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg transition-colors duration-300 ${
                      activeStep === index 
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/40' 
                        : 'bg-white/10 text-slate-200'
                    }`}>
                      {index + 1}
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-slate-50">
                      {step.title}
                    </h4>
                    <p className="text-sm text-slate-200/80">
                      {step.description}
                    </p>
                  </div>
                  
                  {index < flowSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 translate-x-full">
                      <ArrowRight className="w-6 h-6 text-purple-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="mb-4 text-slate-200/80">
              {tTechnology('experience')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#hero"
                onClick={scrollToHero}
                className="bg-gradient-to-r from-[#6d28d9] to-[#c084fc] px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-white inline-block shadow-lg shadow-purple-500/30"
              >
                {tTechnology('secureTokens')}
              </a>
              <button
                  onClick={() => window.open("https://docs.mandalachain.io/", "_blank")}
                  className="border-2 border-white/20 px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:bg-purple-500/10 text-white">
                {tTechnology('viewDocs')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;
