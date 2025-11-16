'use client'
import React from 'react';
import { Twitter, Github, Linkedin, MessageCircle, Mail, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from "next/image";

interface FooterProps {
  onTermsClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onTermsClick }) => {
  const tSocial = useTranslations('social');
  const tNavigation = useTranslations('navigation');
  const tFooter = useTranslations('footer');
  const t = useTranslations('comingSoon');


  const quickLinks = [
    { name: tNavigation('technology'), href: "#technology" },
    { name: tNavigation('tokenomics'), href: "#tokenomics" },
    {name: tNavigation('useCases'), href: '#traction'},
    { name: tNavigation('roadmap'), href: "#roadmap" },
    { name: tNavigation('faq'), href: "#faq" },
    { name: tNavigation('terms'), href: "#", onClick: onTermsClick }
  ];

  return (
    <footer className="bg-black/60 border-t border-purple-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12" data-aos="fade-up">
          {/* Brand */}
          <div className="lg:col-span-1" data-aos="fade-right" data-aos-delay="100">
            <div className="flex items-center space-x-2 mb-6">
              <Image src="/images/mandala-logo-text-dark.png" alt="main-icon" width={200} height={200}/>
            </div>
            <p className="text-slate-300/80 mb-6 leading-relaxed">
              {tFooter('brandDescription')}
            </p>
            <div className="flex items-center text-slate-300/80 mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{tFooter('location')}</span>
            </div>
            <div className="flex items-center text-slate-300/80 mb-4">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm">{tFooter('email')}</span>
            </div>

            {/*Social Icons*/}
            <div className="flex flex-row items-center text-slate-300/80 mt-8 gap-3">
              <a
                  href={t('links.telegram')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
              >
                <Image src="/images/telegram.png"
                       alt="discord" width={25} height={25} className="mr-2"/>
              </a>

              <a
                  href={t('links.twitter')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center">
                <Image src="/images/X_icon.png"
                       alt="discord" width={25} height={25} className="mr-2"/>
              </a>

              <a
                  href={t('links.discord')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center">
                <Image src="/images/discord.png"
                       alt="discord" width={25} height={25} className="mr-2"/>
              </a>

              <a
                  href={t('links.medium')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center">
                <Image src="/images/medium.png"
                       alt="discord" width={25} height={25} className="mr-2"/>
              </a>
            </div>
          </div>

          {/* Quick Links */}
            <div data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-white font-semibold mb-6">{tFooter('quickLinks')}</h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  link.onClick ? (
                    <button
                      key={index}
                      onClick={link.onClick}
                      className="block text-slate-300/80 hover:text-purple-200 transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a
                      key={index}
                      href={link.href}
                      className="block text-slate-300/80 hover:text-purple-200 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                )
              ))}
            </div>
          </div>

          {/* Newsletter */}
            <div data-aos="fade-left" data-aos-delay="300">
              <h3 className="text-white font-semibold mb-6">{tFooter('stayUpdated')}</h3>
              <p className="text-slate-300/80 mb-4 text-sm">
                {tFooter('newsletterDescription')}
              </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder={tFooter('emailPlaceholder')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
              />
              <button className="w-full bg-gradient-to-r from-[#6d28d9] to-[#c084fc] px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200">
                {tFooter('subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* Social & Bottom */}
        {/*<div className="border-t border-gray-800 pt-8" data-aos="fade-up" data-aos-delay="400">*/}
        {/*  <div className="flex flex-col md:flex-row justify-between items-center">*/}
        {/*    <div className="text-center md:text-right">*/}
        {/*      <p className="text-gray-400 text-sm mb-2">*/}
        {/*        {tFooter('copyright')}*/}
        {/*      </p>*/}
        {/*      <p className="text-gray-500 text-xs">*/}
        {/*        {tFooter('riskDisclaimer')}*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </footer>
  );
};

export default Footer;
