'use client'
import React from 'react';
import { TrendingUp, Globe, Shield, Zap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslations } from 'next-intl';

const Opportunity = () => {
  const { isDark } = useTheme();
  const tOpportunity = useTranslations('opportunity');

  const features = [
    {
      icon: <Globe className="w-8 h-8 text-purple-400" />,
      title: tOpportunity('features.governmentBacked.title'),
      description: tOpportunity('features.governmentBacked.description')
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
      title: tOpportunity('features.enterpriseDriven.title'),
      description: tOpportunity('features.enterpriseDriven.description')
    },
    {
      icon: <Shield className="w-8 h-8 text-violet-400" />,
      title: tOpportunity('features.communityOwned.title'),
      description: tOpportunity('features.communityOwned.description')
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-400" />,
      title: tOpportunity('features.aiFirst.title'),
      description: tOpportunity('features.aiFirst.description')
    }
  ];

  return (
    <section id="opportunity" className={`py-20 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              {tOpportunity('title.part1')}
            </span>
            <br />
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{tOpportunity('title.part2')}</span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {tOpportunity('description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className={`backdrop-blur-sm border rounded-2xl p-8 h-full transition-all duration-300 hover:border-purple-500/30 hover:transform hover:scale-105 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80'
                  : 'bg-white/50 border-gray-200 hover:bg-white/80'
              }`}>
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className={`rounded-3xl p-12 border ${
            isDark 
              ? 'bg-gradient-to-r from-gray-800/80 to-gray-700/80 border-gray-600'
              : 'bg-gradient-to-r from-purple-50/80 to-violet-50/80 border-gray-200'
          }`}>
            <h3 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {tOpportunity('cta.title')}
            </h3>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {tOpportunity('cta.description')}
            </p>
            <a
              href="#hero"
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 px-12 py-5 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-105 text-white inline-block shadow-2xl"
            >
              {tOpportunity('cta.button')}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Opportunity;