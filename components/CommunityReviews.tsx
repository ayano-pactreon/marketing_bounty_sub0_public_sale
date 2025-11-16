'use client'
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Image from "next/image";
import {useTranslations} from "next-intl";

const CommunityReviews = () => {
  const { isDark } = useTheme();
  const tCommunityReview = useTranslations('communityReview');

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };
  
  const videos = tCommunityReview.raw('videos') as string[];

  return (
    <section id="community-reviews" className={`py-20 ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 text-[#3D5BC4] ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {tCommunityReview('title')}
          </h2>

          <div className="flex justify-center items-center mb-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mx-1">
                <Image
                  src={isDark ? "/images/star-darkmode.png" : "/images/star-lightmode.png"}
                  alt="Star rating"
                  width={28}
                  height={28}
                  className="w-8 h-8"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {videos && videos.map((videoUrl, index) => (
            <div 
              key={index}
              className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-video"
              data-aos={index === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={200 + (index * 200)}
            >
              <iframe
                src={getYouTubeEmbedUrl(videoUrl)}
                title={`Community Review Video ${index + 1}`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityReviews;
