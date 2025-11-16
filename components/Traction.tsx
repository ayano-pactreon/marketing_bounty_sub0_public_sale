'use client'
import React, { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Image from "next/image";
import {useTranslations} from "next-intl";
import {useIsMobile} from "@/hooks/useIsMobile";

const Traction = () => {
  const { isDark } = useTheme();
  const [activeUseCase, setActiveUseCase] = useState(0);
  const tTraction = useTranslations('traction');
  const tCommon = useTranslations('common');
  const isMobile = useIsMobile();
  
  // Add CSS animation keyframes to document head
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes scrollPartners {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-20 * (12rem + 3rem)));
          }
        }
        @keyframes scrollAsSeen {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-6 * (12rem + 2rem)));
          }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
  const useCases = [
    {
      icon: '/images/Vector.png',
      title: tTraction('useCases.idchain.title'),
      status: tTraction('status.testnet'),
      description: tTraction('useCases.idchain.description'),
      metrics: tTraction('useCases.idchain.metrics'),
      details: tTraction('useCases.idchain.details'),
      height: 36,
      width: 36,
      link: tTraction('useCases.idchain.link'),
      image: "/images/liveUseCases/IDCHAIN.svg"
    },
    {
      icon: '/images/west-java.png',
      title: tTraction('useCases.westJava.title'),
      status: tTraction('status.beta'),
      description: tTraction('useCases.westJava.description'),
      metrics: tTraction('useCases.westJava.metrics'),
      details: tTraction('useCases.westJava.details'),
      height: 40,
      width: 40,
      link: tTraction('useCases.westJava.link'),
      image: "/images/liveUseCases/Government Blockchain Infra.svg"
    },
    {
      icon: '/images/shield-icon.png',
      title: tTraction('useCases.ipProtection.title'),
      status: tTraction('status.mvp'),
      description: tTraction('useCases.ipProtection.description'),
      metrics: tTraction('useCases.ipProtection.metrics'),
      details: tTraction('useCases.ipProtection.details'),
      height: 26,
      width: 26,
      link: tTraction('useCases.ipProtection.link'),
      image: "/images/liveUseCases/KRAFLABS.svg"
    },
    {
      icon: '/images/Group 9.png',
      title: tTraction('useCases.cooperative.title'),
      status: tTraction('status.mvp'),
      description: tTraction('useCases.cooperative.description'),
      metrics: tTraction('useCases.cooperative.metrics'),
      details: tTraction('useCases.cooperative.details'),
      height: 25,
      width: 25,
      link: tTraction('useCases.cooperative.link'),
      image: "/images/liveUseCases/COOP.svg"
    }
  ];

  const milestones = [
    {
      date: tTraction('roadmap.q2.2025.date'),
      title: tTraction('roadmap.q2.2025.title'),
      description: tTraction('roadmap.q2.2025.description'),
      completed: true
    },
    {
      date: tTraction('roadmap.q3.2025.date'),
      title: tTraction('roadmap.q3.2025.title'),
      description: tTraction('roadmap.q3.2025.description'),
      completed: false
    },
    {
      date: tTraction('roadmap.q4.2025.date'),
      title: tTraction('roadmap.q4.2025.title'),
      description: tTraction('roadmap.q4.2025.description'),
      completed: false
    },
    {
      date: tTraction('roadmap.q1.2026.date'),
      title: tTraction('roadmap.q1.2026.title'),
      description: tTraction('roadmap.q1.2026.description'),
      completed: false
    }
  ];

  const partner = [
    { name: "BRIN", logo: "/images/partners/BRIN.png", darkLogo: "/images/darkmode/partners/BRIN.png" },
    { name: "KrafLab", logo: "/images/partners/KrafLab.png", darkLogo: "/images/darkmode/partners/KrafLab.png" },
    { name: "PAAL", logo: "/images/partners/PAAL.png", darkLogo: "/images/darkmode/partners/PAAL.png" },
    { name: "SumSub", logo: "/images/partners/SumSub.png", darkLogo: "/images/darkmode/partners/SumSub.png" },
    { name: "foru", logo: "/images/partners/foru.png", darkLogo: "/images/darkmode/partners/foru.png" },
    { name: "BitLayer", logo: "/images/partners/BitLayer.png", darkLogo: "/images/darkmode/partners/BitLayer.png" },
    { name: "NLSVentures", logo: "/images/partners/NLSVentures.png", darkLogo: "/images/darkmode/partners/NLSVentures.png" },
    { name: "PANDI", logo: "/images/partners/PANDI.png", darkLogo: "/images/darkmode/partners/PANDI.png" },
    { name: "Unu", logo: "/images/partners/Unu.png", darkLogo: "/images/darkmode/partners/Unu.png" },
    { name: "harbour", logo: "/images/partners/harbour.png", darkLogo: "/images/darkmode/partners/harbour.png" },
    { name: "CFII", logo: "/images/partners/CFII.png", darkLogo: "/images/darkmode/partners/CFII.png" },
    { name: "OffChain", logo: "/images/partners/OffChain.png", darkLogo: "/images/darkmode/partners/OffChain.png" },
    { name: "Polkadot", logo: "/images/partners/Polkadot-Logo.png", darkLogo: "/images/darkmode/partners/Polkadot-Logo.png" },
    { name: "VIDA", logo: "/images/partners/VIDA.png", darkLogo: "/images/darkmode/partners/VIDA.png" },
    { name: "interlace", logo: "/images/partners/interlace.png", darkLogo: "/images/darkmode/partners/interlace.png" },
    { name: "DJOIN", logo: "/images/partners/DJOIN.png", darkLogo: "/images/darkmode/partners/DJOIN.png" },
    { name: "OnJourney", logo: "/images/partners/OnJourney.png", darkLogo: "/images/darkmode/partners/OnJourney.png" },
    { name: "Republik", logo: "/images/partners/Republik.png", darkLogo: "/images/darkmode/partners/Republik.png" },
    { name: "West Java", logo: "/images/partners/West_Java.png", darkLogo: "/images/darkmode/partners/Republik.png" },
    { name: "zkme", logo: "/images/partners/zkme.png", darkLogo: "/images/darkmode/partners/zkme.png" },
  ];

  const asSeen = [
    { name: "BI", logo: "/images/asSeen/BI.png", darkLogo: "/images/darkmode/asSeen/Logo-BI.png" },
    { name: "Benzinga", logo: "/images/asSeen/Benzinga.png", darkLogo: "/images/darkmode/asSeen/Logo-Benzinga 1.png" },
    { name: "Decrypt", logo: "/images/asSeen/Decrypt.png", darkLogo: "/images/darkmode/asSeen/Logo-Decrypt 1.png" },
    { name: "Investing", logo: "/images/asSeen/Investing.png", darkLogo: "/images/darkmode/asSeen/Logo-Investing.png" },
    { name: "CoinMarketCap", logo: "/images/asSeen/coinmarketcap.png", darkLogo: "/images/darkmode/asSeen/Logo-coinmarketcap 1.png" },
    { name: "CryptoDailyStore", logo: "/images/asSeen/cryptodailystore.png", darkLogo: "/images/darkmode/asSeen/Logo-cryptodailystore 1.png" },
  ];

  const scrollToHero = () => {
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


  return (
    <section id="traction" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0819]/90 via-[#0d0820]/90 to-[#05030e] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(192,132,252,0.18),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.18),transparent_35%)] pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Background pattern */}
        {
            tCommon('elementToggle') === 'true' && (
                <div
                    className="absolute inset-0 top-0 bg-[url('/images/03.png')] bg-no-repeat pointer-events-none"
                    style={{
                      backgroundSize: '100%',
                      backgroundPosition: 'center top -180px',
                      transform: 'scaleX(1.4)'
                    }}
                ></div>
            )
        }
        <div className="text-center mb-30" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-10">
            <span className="text-slate-100">{tTraction('title.part1')}</span>
            <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#a855f7] bg-clip-text text-transparent">
              {tTraction('title.part2')}
            </span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-slate-200/80">
            {tTraction('description')}
          </p>
        </div>

        {/* Use Cases */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div data-aos="fade-right" data-aos-delay="100">
            <h3 className="text-2xl font-bold mb-8 text-slate-50">{tTraction('liveUseCases')}</h3>
            <div className="space-y-4">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 glass-panel ${
                    activeUseCase === index
                      ? 'border-purple-400/60 ring-2 ring-purple-500/30'
                      : 'border-white/10 hover:border-purple-300/60'
                  }`}
                  onClick={() => setActiveUseCase(index)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {typeof useCase.icon === 'string' ? (
                          <div className="mr-4">
                            <Image
                                src={useCase.icon}
                                alt={`${useCase.title} icon`}
                                width={useCase.width}
                                height={useCase.height}
                                className="object-contain"
                            />
                          </div>
                      ) : (
                          <div className="mr-4">{useCase.icon}</div>
                      )}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-50">{useCase.title}</h4>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          useCase.status === 'Live' ? 'bg-green-500/20 text-green-300' :
                          useCase.status === 'Active' ? 'bg-purple-500/20 text-purple-300' :
                          useCase.status === 'Beta' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-violet-500/20 text-violet-300'
                        }`}>
                          {useCase.status}
                        </span>
                      </div>
                    </div>
                    <a
                        href={useCase.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                      <ExternalLink
                          className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                      />
                    </a>
                  </div>
                  <p className="mb-2 text-slate-200/80">{useCase.description}</p>
                  <p className="font-semibold text-purple-400">{useCase.metrics}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl p-8 glass-panel border border-white/10" data-aos="fade-left" data-aos-delay="200">
            <h4 className="text-xl font-bold mb-4 text-slate-50">{useCases[activeUseCase].title}</h4>
            <p className="mb-6 leading-relaxed text-slate-200/80">{useCases[activeUseCase].details}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300/80">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  useCases[activeUseCase].status === tTraction('status.live') ? 'bg-green-500/20 text-green-300' :
                  useCases[activeUseCase].status === tTraction('status.active') ? 'bg-purple-500/20 text-purple-300' :
                  useCases[activeUseCase].status === tTraction('status.beta') ? 'bg-orange-500/20 text-orange-300' :
                  'bg-violet-500/20 text-violet-300'
                }`}>
                  {useCases[activeUseCase].status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300/80">Scale</span>
                <span className="text-purple-400 font-semibold">{useCases[activeUseCase].metrics}</span>
              </div>
            </div>

            <a
                href={useCases[activeUseCase].link}
                target="_blank"
                rel="noopener noreferrer"
            >
              <button className="w-full mt-6 bg-gradient-to-r from-[#6d28d9] to-[#c084fc] px-6 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer">
                <span className="text-white">{tTraction('viewCaseStudy')}</span>
              </button>
            </a>
            
            <button
                onClick={scrollToHero}
              className="w-full mt-3 border-2 border-purple-500/30 hover:border-purple-500 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-purple-500/10 text-purple-400 hover:text-purple-300 inline-block text-center cursor-pointer"
            >
              {tTraction('joinPresale')}
            </button>
            <div className="mt-4">
              <Image
                  src={useCases[activeUseCase].image}
                  alt="IDCHAIN"
                  width={200}
                  height={200}
                  className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div id="roadmap" className="mb-16" data-aos="fade-up" data-aos-delay="300">
          <h3 className="text-2xl font-bold mb-8 text-center text-slate-50">{tTraction('roadmap.title')}</h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#6d28d9] to-[#c084fc]"></div>
            <div className="">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} ${index !== 0 ? '-mt-10' : ''}`} data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'} data-aos-delay={400 + (index * 100)}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`border rounded-2xl p-6 glass-panel ${
                      milestone.completed 
                        ? 'border-green-500/40'
                        : 'border-white/10'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-400">{milestone.date}</span>
                        {milestone.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                      </div>
                      <h4 className="text-lg font-semibold mb-2 text-slate-50">{milestone.title}</h4>
                      <ul className="text-sm text-slate-300/80">
                        {milestone.description.split('•').map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className={`w-4 h-4 rounded-full border-4 ${
                      milestone.completed 
                        ? 'bg-green-500 border-green-400' 
                        : 'bg-white/40 border-white/30'
                    }`}></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="rounded-3xl p-8 mb-16 glass-panel border border-white/10" data-aos="fade-up" data-aos-delay="500">
          <h3 className="text-4xl md:text-5xl font-bold mb-12 text-center text-slate-50 ">
            {tTraction('partners.title')}
          </h3>
          <div className="overflow-hidden pt-4">
            <div className="flex space-x-12" style={{ width: 'calc(40 * (12rem + 3rem))', animation: 'scrollPartners 50s linear infinite'}}>
              {/* First set of partners with logos */}
              {partner.map((p, index) => (
                <div key={index} className="flex-shrink-0 text-center w-48">
                  <div className="rounded-2xl border hover:border-purple-500/40 transition-all duration-300 mb-4 h-32 flex items-center justify-center hover:scale-105 p-6 glass-panel border-white/10">
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src={isDark ? p.darkLogo : p.logo}
                        alt={p.name}
                        width={120}
                        height={120}
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partner.map((p, index) => (
                <div key={`duplicate-${index}`} className="flex-shrink-0 text-center w-48">
                  <div className="rounded-2xl border hover:border-purple-500/40 transition-all duration-300 mb-4 h-32 flex items-center justify-center hover:scale-105 p-6 glass-panel border-white/10">
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                          src={isDark ? p.darkLogo : p.logo}
                        alt={p.name}
                        width={120}
                        height={120}
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* As Seen On Section */}
        <div className="rounded-3xl p-8 border glass-panel border-white/10" data-aos="fade-up" data-aos-delay="500">
          <h3 className="text-4xl md:text-5xl font-bold mb-12 text-center text-slate-50 ">
            {tTraction('asSeen.title')}
          </h3>
          <div className="overflow-hidden pt-4">
            <div className={`flex space-x-8 ${isMobile ? 'overflow-x-auto w-full' : ''}`}>
              {/* First set of asSeen items */}
              {asSeen.map((p, index) => (
                  <div key={index} className="flex-shrink-0 text-center w-48">
                    <div className="rounded-2xl border hover:border-purple-500/30 transition-all duration-300 mb-4 h-32 flex items-center justify-center hover:scale-105 p-6 glass-panel border-white/10">
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                            src={isDark ? p.darkLogo : p.logo}
                            alt={p.name}
                            width={120}
                            height={120}
                            className="object-contain max-w-full max-h-full"
                        />
                      </div>
                    </div>
                  </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {asSeen.map((p, index) => (
                  <div key={`duplicate-${index}`} className="flex-shrink-0 text-center w-48">
                    <div className="rounded-2xl border hover:border-purple-500/30 transition-all duration-300 mb-4 h-32 flex items-center justify-center hover:scale-105 p-6 glass-panel border-white/10">
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                            src={isDark ? p.darkLogo : p.logo}
                            alt={p.name}
                            width={120}
                            height={120}
                            className="object-contain max-w-full max-h-full"
                        />
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Traction;
