'use client'
import React from 'react';
import { Twitter, Heart, MessageCircle, Repeat2, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslations } from 'next-intl';
import tweetsData from '@/messages/tweets.json';
import Image from "next/image";

const TwitterFeed = () => {
  const { isDark } = useTheme();
  const tTwitter = useTranslations('twitter');

  const tweets = tweetsData.data.map((tweet: Record<string, unknown>, index: number) => {
    const date = new Date(tweet.created_at as string);
    const timeAgo = formatTimeAgo(date);
    
    // Use real metrics from fetched data, with fallback for missing data
    // const tweetIdNum = parseInt(tweet.id.slice(-3));
    // const likes = tweet.likes?.toString() || (45 + (tweetIdNum % 55)).toString();
    // const retweets = tweet.retweets?.toString() || (12 + (tweetIdNum % 38)).toString();
    // const replies = tweet.comments?.toString() || (3 + (tweetIdNum % 17)).toString();
    
    return {
      id: index + 1,
      author: 'ZexifyChain',
      handle: '@ZexifyChain',
      time: timeAgo,
      content: (tweet.text as string).replace(/&amp;/g, '&'),
      likes: tweet.likes,
      retweets: tweet.retweets,
      replies: tweet.comments,
      verified: true
    };
  });

  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  }

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

  return (
    <section id="twitter" className={`py-20 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{tTwitter('latest')}</span>
            <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#a855f7] bg-clip-text text-transparent">
              {tTwitter('updates')}
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {tTwitter('description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tweets.map((tweet) => (
            <div
              key={tweet.id}
              className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/30 hover:-translate-y-1 flex flex-col h-full ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80'
                  : 'bg-gray-50/50 border-gray-200 hover:bg-gray-50/80'
              }`}
              data-aos="fade-up"
              data-aos-delay={100 + (tweet.id * 100)}
            >
              {/* Tweet Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center mr-3">
                    <Image src="/images/mandala-logo-icon.jpg" alt="mandala-logo-icon" width={50} height={50}/>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {tweet.author}
                      </span>
                      {tweet.verified && (
                        <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center ml-1">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {tweet.handle} · {tweet.time}
                    </div>
                  </div>
                </div>
                {/*<Twitter className="w-5 h-5 text-purple-400" />*/}
                <Image src="/images/X_icon.png"
                       alt="twitter" width={25} height={25} className=""/>
              </div>

              {/* Tweet Content - flex-grow pushes actions to bottom */}
              <div className="flex-grow">
                <p className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {tweet.content}
                </p>
              </div>

              {/* Tweet Actions - always at bottom */}
              <div className={`flex items-center justify-between pt-3 mt-4 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-300'
              }`}>
                <button className={`flex items-center space-x-2 text-sm transition-colors hover:text-purple-400 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <MessageCircle className="w-4 h-4" />
                  <span>{tweet.replies as string}</span>
                </button>
                <button className={`flex items-center space-x-2 text-sm transition-colors hover:text-green-400 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Repeat2 className="w-4 h-4" />
                  <span>{tweet.retweets as string}</span>
                </button>
                <button className={`flex items-center space-x-2 text-sm transition-colors hover:text-red-400 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Heart className="w-4 h-4" />
                  <span>{tweet.likes as string}</span>
                </button>
                <button className={`text-sm transition-colors hover:text-purple-400 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Follow Button */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="600">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#hero"
              onClick={scrollToHero}
              className="bg-gradient-to-r from-[#6d28d9] to-[#c084fc] px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-white inline-block"
            >
              {tTwitter('getTokens')}
            </a>
            <a
              href="https://x.com/ZexifyChain"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-3"
            >
              <Image src="/images/X_logo_white.png"
                     alt="twitter" width={25} height={25} className="mr-2"/>
              <span className="text-white">{tTwitter('followUs')}</span>
              <ExternalLink className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwitterFeed;
