'use client'
import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import Image from "next/image";
import {useTranslations} from "next-intl";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right"
interface UseCase {
  title: string
  percentage: string
  icon: string
  position: Position
}

const Tokenomics = () => {
  const [selectedAllocation, setSelectedAllocation] = useState(0);
  const currentActiveStage = 4; // Change this to control which stage is active
  const tTokenomics = useTranslations('tokenomics');

  // Function to handle smooth scroll to hero section
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
  const allocations = [
    {
      label: tTokenomics('allocation.ecosystem.label'),
      percentage: 40,
      color: "bg-emerald-500",
      description: tTokenomics('allocation.ecosystem.description')
    },
    {
      label: tTokenomics('allocation.treasury.label'),
      percentage: 20,
      color: "bg-orange-500",
      description: tTokenomics('allocation.treasury.description')
    },
    {
      label: tTokenomics('allocation.team.label'),
      percentage: 15,
      color: "bg-violet-500",
      description: tTokenomics('allocation.team.description')
    },
    {
      label: tTokenomics('allocation.public.label'),
      percentage: 12,
      color: "bg-purple-500",
      description: tTokenomics('allocation.public.description')
    },
    {
      label: tTokenomics('allocation.parachain.label'),
      percentage: 8,
      color: "bg-pink-500",
      description: tTokenomics('allocation.parachain.description')
    },
    {
      label: tTokenomics('allocation.preseed.label'),
      percentage: 5,
      color: "bg-cyan-500",
      description: tTokenomics('allocation.preseed.description')
    }
  ];

  const allStages = [
    { stage: 1, price: 0.025, status: "Completed", raised: "50k" },
  ];

  // Only show stages up to current active stage + 1
  const visibleStages = allStages.filter(stage => stage.stage <= currentActiveStage + 1);

  const useCases: UseCase[] = [
    {
      title: tTokenomics('utility.governance.title'),
      percentage: tTokenomics('utility.governance.apy'),
      icon: "/images/Layer_1.png",
      position: "top-left"
    },
    {
      title: tTokenomics('utility.staking.title'),
      percentage: tTokenomics('utility.staking.apy'),
      icon: "/images/Group 1.png",
      position: "bottom-left"
    },
    {
      title: tTokenomics('utility.aiInference.title'),
      percentage: tTokenomics('utility.aiInference.revenue'),
      icon: "/images/Group 3.png",
      position: "top-right"
    },
    {
      title: tTokenomics('utility.coreInfraLicensing.title'),
      percentage: tTokenomics('utility.coreInfraLicensing.burn'),
      icon: "/images/Layer_2.png",
      position: "bottom-right"
    },
    {
      title: tTokenomics('utility.sovereignLicenses.title'),
      percentage: tTokenomics('utility.sovereignLicenses.bonded'),
      icon: "/images/Layer_3.png",
      position: "bottom-right"
    },
    {
      title: tTokenomics('utility.networkFees.title'),
      percentage: tTokenomics('utility.networkFees.burn'),
      icon: "/images/Dollar Coin.png",
      position: "bottom-right"
    }
  ];

  return (
    <section id="tokenomics" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">{tTokenomics('title.part1')}</span>
            <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#a855f7] bg-clip-text text-transparent">
              {tTokenomics('title.part2')}
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {tTokenomics('description')}
          </p>
        </div>

        <div className="flex flex-col justify-center items-center gap-6 mb-16">
          {/* Token Allocation */}
          {/*<div>*/}
          {/*  <Image src="/images/coins.png" alt="coins" width={500} height={500} />*/}
          {/*</div>*/}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8" data-aos="fade-right" data-aos-delay="100">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Image src="/images/Group 2.png" alt="bill" width={30} height={30} />
              {tTokenomics('allocation.title')}
            </h3>

           <div className="flex items-center gap-2">
             {/*Pie Chart*/}
             <div className="relative mb-8">
               <div className="">
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                   {allocations.map((allocation, index) => {
                     const offset = allocations.slice(0, index).reduce((sum, a) => sum + a.percentage, 0);
                     const circumference = 2 * Math.PI * 40;
                     const strokeDasharray = `${(allocation.percentage / 100) * circumference} ${circumference}`;
                     const strokeDashoffset = -((offset / 100) * circumference);

                     return (
                         <circle
                             key={index}
                             cx="50"
                             cy="50"
                             r="40"
                             fill="transparent"
                             stroke={`rgb(${allocation.color.includes('blue') ? '59, 130, 246' :
                                 allocation.color.includes('violet') ? '139, 92, 246' :
                                     allocation.color.includes('emerald') ? '16, 185, 129' :
                                         allocation.color.includes('orange') ? '249, 115, 22' :
                                             allocation.color.includes('pink') ? '236, 72, 153' : '8, 145, 178'})`}
                             strokeWidth="8"
                             strokeDasharray={strokeDasharray}
                             strokeDashoffset={strokeDashoffset}
                             className={`transition-all duration-300 cursor-pointer ${
                                 selectedAllocation === index ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                             }`}
                             onMouseEnter={() => setSelectedAllocation(index)}
                         />
                     );
                   })}
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-center">
                     <div className="text-2xl font-bold text-white">
                       {allocations[selectedAllocation].percentage}%
                     </div>
                     <div className="text-sm text-gray-400">
                       {allocations[selectedAllocation].label}
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/*List*/}
             <div className="space-y-3">
               {allocations.map((allocation, index) => (
                   <div
                       key={index}
                       className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                           selectedAllocation === index ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'
                       }`}
                       onMouseEnter={() => setSelectedAllocation(index)}
                   >
                     <div className="flex items-center">
                       <div className={`w-4 h-4 rounded-full ${allocation.color} mr-3`}></div>
                       <div>
                         <div className="text-white font-medium">{allocation.label}</div>
                         <div className="text-xs text-gray-400">{allocation.description}</div>
                       </div>
                     </div>
                     <div className="text-lg font-bold text-purple-400">{allocation.percentage}%</div>
                   </div>
               ))}
             </div>
           </div>
          </div>

          {/* ICO Stages */}
          {/*<div className="flex flex-col items-center w-full">*/}
          {/*  <Image src="/images/coins.png" alt="coins" width={500} height={500} />*/}
          {/*  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 w-full h-full" data-aos="fade-left" data-aos-delay="200">*/}
          {/*    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">*/}
          {/*      <TrendingUp className="w-6 h-6 text-violet-400 mr-3" />*/}
          {/*      {tTokenomics('icoStages.title')}*/}
          {/*    </h3>*/}

          {/*    /!*stages with price*!/*/}
          {/*    <div className="space-y-3 mb-4">*/}
          {/*      {visibleStages.map((stage, index) => (*/}
          {/*          <div*/}
          {/*              key={index}*/}
          {/*              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${*/}
          {/*                  stage.status === 'Active'*/}
          {/*                      ? 'bg-purple-500/10 border-purple-500/30'*/}
          {/*                      : stage.status === 'Completed'*/}
          {/*                          ? 'bg-green-500/10 border-green-500/30'*/}
          {/*                          : 'bg-gray-700/30 border-gray-600'*/}
          {/*              }`}*/}
          {/*          >*/}
          {/*            <div className="flex items-center">*/}
          {/*              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${*/}
          {/*                  stage.status === 'Active' ? 'bg-purple-500 text-white' :*/}
          {/*                      stage.status === 'Completed' ? 'bg-green-500 text-white' :*/}
          {/*                          'bg-gray-600 text-gray-300'*/}
          {/*              }`}>*/}
          {/*                {stage.stage}*/}
          {/*              </div>*/}
          {/*              <div>*/}
          {/*                <div className="text-white font-medium">{stage.stage === 1 ? 'Coinfest Sale' : `Stage ${stage.stage}`}</div>*/}
          {/*                <div className="text-sm text-gray-400">*/}
          {/*                  {stage.status === "Coming" ? "Price TBD" : `$${stage.price.toFixed(3)} ${tTokenomics('perZedi')}`}*/}
          {/*                </div>*/}
          {/*              </div>*/}
          {/*            </div>*/}
          {/*            <div className="text-right">*/}
          {/*              <div className={`text-sm font-medium ${*/}
          {/*                  stage.status === 'Active' ? 'text-purple-400' :*/}
          {/*                      stage.status === 'Completed' ? 'text-green-400' :*/}
          {/*                          'text-gray-400'*/}
          {/*              }`}>*/}
          {/*                {stage.status === 'Active' ? tTokenomics('stages.active') :*/}
          {/*                    stage.status === 'Completed' ? tTokenomics('stages.completed') :*/}
          {/*                        tTokenomics('stages.coming')}*/}
          {/*              </div>*/}
          {/*              <div className="text-xs text-gray-400">*/}
          {/*                {stage.raised !== '-' ? `$${stage.raised} ${tTokenomics('stages.target')}` : tTokenomics('stages.tbd')}*/}
          {/*              </div>*/}
          {/*            </div>*/}
          {/*          </div>*/}
          {/*      ))}*/}
          {/*    </div>*/}

          {/*    /!*second stage: next stage*!/*/}
          {/*    <div className="bg-gradient-to-r from-[#6d28d9]/10 to-[#c084fc]/10 rounded-xl p-4 border border-purple-500/30 mb-4">*/}
          {/*      <div className="text-center">*/}
          {/*        <div className="text-sm text-purple-300 mb-1">{tTokenomics('nextStagePrice')}</div>*/}
          {/*        <div className="text-2xl font-bold text-white">*/}
          {/*          /!*${nextStage?.price.toFixed(3) || '0.030'}*!/*/}
          {/*        </div>*/}
          {/*        <div className="text-sm text-gray-400">*/}
          {/*          /!*{nextStage && allStages[currentActiveStage - 1]*!/*/}
          {/*          /!*    ? `${Math.round(((nextStage.price - allStages[currentActiveStage - 1].price) / allStages[currentActiveStage - 1].price) * 100)}% ${tTokenomics('priceIncrease')}`*!/*/}
          {/*          /!*    : '20% ${tTokenomics(\'priceIncrease\')}'*!/*/}
          {/*          /!*}*!/*/}
          {/*          {tTokenomics('stages.tbd')}*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}

          {/*    /!*third stage coming soon*!/*/}
          {/*    <div className="bg-gradient-to-r bg-gray-700/30 border border-gray-600 rounded-xl p-4">*/}
          {/*      <div className="text-center text-gray-400">*/}
          {/*        <div className="text-sm">*/}
          {/*          {tTokenomics('stages.coming')}*/}
          {/*        </div>*/}
          {/*        <div className="text-sm">*/}
          {/*          {tTokenomics('stages.tbd')}*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}

          {/*  </div>*/}
          {/*</div>*/}
        </div>

        {/* Token Utility */}
        <div className="p-12  relative overflow-hidden">
          <h3 className="text-4xl font-bold text-white mb-16 text-center relative z-10">
            {tTokenomics('utilityTitle')}
          </h3>

          {/* Cards layout with background image - Responsive */}
          <div className="relative w-full max-w-4xl mx-auto mb-16">
            {/* Mobile: Stack cards vertically */}
            <div className="lg:hidden space-y-4">
              {useCases.map((useCase, index) => (
                <div key={index} className="w-full">
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 group h-40">
                    {/* Card glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6d28d9] to-[#c084fc] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex flex-col items-center justify-center h-full relative z-10">
                      <div className="flex flex-col items-center justify-center flex-grow">
                        <div className="w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300 mb-3">
                          <Image src={useCase.icon} alt="icon" width={32} height={32} />
                        </div>
                        <div className="text-lg text-center font-semibold text-purple-400 group-hover:text-purple-300 transition-colors duration-300 mb-2 leading-tight">
                          {useCase.title}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors duration-300 mt-auto">
                        {useCase.percentage}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Use cases Square Section */}
            <div className="hidden lg:block relative h-[500px] bg-[url('/images/07.png'),url('/images/color-dodge.png')] bg-[length:auto_120%,85%] bg-center bg-no-repeat rounded-2xl">
              {useCases.map((useCase, index) => {
                const positions = [
                  // Top row (moved higher + more horizontal gap)
                  "top-[-5%] left-[15%]",
                  "top-[-5%] right-[15%]",

                  // Middle row (wide apart)
                  "top-1/2 -translate-y-1/2 left-[0%]",
                  "top-1/2 -translate-y-1/2 right-[0%]",

                  // Bottom row (moved lower + more horizontal gap)
                  "bottom-[-5%] left-[15%]",
                  "bottom-[-5%] right-[15%]"
                ];

                return (
                    <div key={index} className={`absolute ${positions[index]} w-64 z-10`}>
                      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/50 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 group h-40 min-h-40">
                        {/* Glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex flex-col items-center justify-center h-full relative z-10">
                          <div className="flex flex-col items-center justify-center flex-grow">
                            <div className="w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300 mb-3">
                              <Image src={useCase.icon} alt="icon" width={32} height={32} />
                            </div>
                            <div className="text-lg text-center font-semibold text-purple-400 group-hover:text-purple-300 transition-colors duration-300 mb-2 leading-tight">
                              {useCase.title}
                            </div>
                          </div>
                          <div className="text-sm font-bold text-center text-white group-hover:text-purple-300 transition-colors duration-300 mt-auto">
                            {useCase.percentage}
                          </div>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>

          <div className="text-center relative z-10">
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              {tTokenomics('ctaDescription')}
            </p>

            <button 
              onClick={scrollToHero}
              className="bg-gradient-to-r from-[#6d28d9] to-[#c084fc] px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-white shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">{tTokenomics('joinIco')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
