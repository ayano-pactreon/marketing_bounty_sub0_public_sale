'use client'
import React, { useState } from 'react';
import { Crown, Shield, Users, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Community = () => {
  const [selectedTier, setSelectedTier] = useState(0);
  const tCommunity = useTranslations('community');

  const tiers = [
    {
      name: tCommunity('tiers.citizen.name'),
      icon: <Users className="w-8 h-8 text-purple-400" />,
      requirement: tCommunity('tiers.citizen.requirement'),
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/20",
      benefits: tCommunity.raw('tiers.citizen.benefits')
    },
    {
      name: tCommunity('tiers.ambassador.name'),
      icon: <Star className="w-8 h-8 text-violet-400" />,
      requirement: tCommunity('tiers.ambassador.requirement'),
      color: "from-violet-500 to-violet-600",
      borderColor: "border-violet-500/30",
      bgColor: "bg-violet-500/20",
      benefits: tCommunity.raw('tiers.ambassador.benefits')
    },
    {
      name: tCommunity('tiers.governor.name'),
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      requirement: tCommunity('tiers.governor.requirement'),
      color: "from-emerald-500 to-emerald-600",
      borderColor: "border-emerald-500/30",
      bgColor: "bg-emerald-500/20",
      benefits: tCommunity.raw('tiers.governor.benefits')
    },
    {
      name: tCommunity('tiers.parliament.name'),
      icon: <Crown className="w-8 h-8 text-orange-400" />,
      requirement: tCommunity('tiers.parliament.requirement'),
      color: "from-orange-500 to-orange-600",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/20",
      benefits: tCommunity.raw('tiers.parliament.benefits')
    }
  ];

  // const stats = [
  //   { label: "Total Members", value: "15,420", icon: <Users className="w-5 h-5" /> },
  //   { label: "ZEDI Staked", value: "45.2M", icon: <Trophy className="w-5 h-5" /> },
  //   { label: "Avg. APY", value: "15.4%", icon: <Gift className="w-5 h-5" /> },
  //   { label: "Governance Votes", value: "127", icon: <Crown className="w-5 h-5" /> }
  // ];

  return (
    <section id="community" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">{tCommunity('digitalNation')}</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              {tCommunity('builders')}
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {tCommunity('description')}
          </p>
        </div>

        {/* Tier Selection */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {tiers.map((tier, index) => (
              <button
                key={index}
                onClick={() => setSelectedTier(index)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedTier === index
                    ? `${tier.borderColor} ${tier.bgColor}`
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                }`}
                data-aos="zoom-in"
                data-aos-delay={200 + (index * 100)}
              >
                <div className="flex items-center space-x-3">
                  {tier.icon}
                  <div className="text-left">
                    <div className="text-lg font-semibold text-white">{tier.name}</div>
                    <div className="text-sm text-gray-400">{tier.requirement}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Tier Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className={`bg-gradient-to-br ${tiers[selectedTier].color} p-8 rounded-3xl relative overflow-hidden`} data-aos="fade-right" data-aos-delay="300">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
              {tiers[selectedTier].icon}
            </div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                  {tiers[selectedTier].icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{tiers[selectedTier].name}</h3>
                  <p className="text-white/80">{tiers[selectedTier].requirement}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-4">{tCommunity('exclusiveBenefits')}</h4>
                <div className="space-y-3">
                  {tiers[selectedTier].benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 border border-white/20">
                {tCommunity('calculateTier')}
              </button>
              
              <a
                href="#hero"
                className="w-full mt-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 border border-white/10 hover:border-white/30 inline-block text-center"
              >
                {tCommunity('buyToUnlockTier')}
              </a>
            </div>
          </div>

          <div className="space-y-8" data-aos="fade-left" data-aos-delay="400">
            {/* Staking Calculator */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8">
              <h4 className="text-xl font-bold text-white mb-6">{tCommunity('stakingCalculator')}</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{tCommunity('zediAmount')}</label>
                  <input
                    type="number"
                    placeholder="10,000"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{tCommunity('stakingPeriod')}</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                    <option>{tCommunity('stakingPeriods.30days')}</option>
                    <option>{tCommunity('stakingPeriods.90days')}</option>
                    <option>{tCommunity('stakingPeriods.180days')}</option>
                    <option>{tCommunity('stakingPeriods.365days')}</option>
                  </select>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">{tCommunity('estimatedRewards')}</span>
                    <span className="text-xl font-bold text-purple-400">1,540 ZEDI</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">{tCommunity('apy')}</span>
                    <span className="text-emerald-400 font-semibold">18.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Governance */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8">
              <h4 className="text-xl font-bold text-white mb-6">{tCommunity('recentGovernanceVotes')}</h4>
              <div className="space-y-4">
                {tCommunity.raw('votes').map((vote: { title: string; votes: string; status: string }, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{vote.title}</div>
                      <div className="text-sm text-gray-400">{vote.votes} votes</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vote.status === 'Active' 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {tCommunity(`voteStatus.${vote.status.toLowerCase()}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;