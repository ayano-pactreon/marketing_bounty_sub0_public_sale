'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslations } from 'next-intl';

const BlogFeed = () => {
  const { isDark } = useTheme();
  const tBlog = useTranslations('blog');
  const tComingSoon = useTranslations('comingSoon');

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

  const posts = [
    // {
    //   title: tBlog('posts.0.title'),
    //   excerpt: tBlog('posts.0.excerpt'),
    //   category: tBlog('posts.0.category'),
    //   date: tBlog('posts.0.date'),
    //   readTime: tBlog('posts.0.readTime'),
    //   image: "/images/blogImage.png",
    //   trending: true,
    //   link: tBlog('posts.0.link')
    // },
    {
      title: tBlog('posts.1.title'),
      excerpt: tBlog('posts.1.excerpt'),
      category: tBlog('posts.1.category'),
      date: tBlog('posts.1.date'),
      readTime: tBlog('posts.1.readTime'),
      link: tBlog('posts.1.link'),
      image: "/images/GoldenVision.png"
    },
    {
      title: tBlog('posts.2.title'),
      excerpt: tBlog('posts.2.excerpt'),
      category: tBlog('posts.2.category'),
      date: tBlog('posts.2.date'),
      readTime: tBlog('posts.2.readTime'),
      link: tBlog('posts.2.link'),
      image: "/images/zedi.png"
    },
    {
      title: tBlog('posts.3.title'),
      excerpt: tBlog('posts.3.excerpt'),
      category: tBlog('posts.3.category'),
      date: tBlog('posts.3.date'),
      readTime: tBlog('posts.3.readTime'),
      link: tBlog('posts.3.link'),
      image: "/images/Summit.png"
    },
    {
      title: tBlog('posts.4.title'),
      excerpt: tBlog('posts.4.excerpt'),
      category: tBlog('posts.4.category'),
      date: tBlog('posts.4.date'),
      readTime: tBlog('posts.4.readTime'),
      link: tBlog('posts.4.link'),
      image: "/images/tokenomics.png"
    },
    {
      title: tBlog('posts.5.title'),
      excerpt: tBlog('posts.5.excerpt'),
      category: tBlog('posts.5.category'),
      date: tBlog('posts.5.date'),
      readTime: tBlog('posts.5.readTime'),
      link: tBlog('posts.5.link'),
      image: "/images/infrastructure.png"
    }
  ];

  // const categories = [
  //   tBlog('categories.all'),
  //   tBlog('categories.marketAnalysis'),
  //   tBlog('categories.technology'),
  //   tBlog('categories.useCases'),
  //   tBlog('categories.tokenomics'),
  //   tBlog('categories.partnerships')
  // ];

  return (
    <section id="blog" className={`py-20 ${
      isDark ? 'bg-gray-800/50' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{tBlog('latest')}</span>
            <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#a855f7] bg-clip-text text-transparent">
              {tBlog('insights')}
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {tBlog('description')}
          </p>
        </div>

        {/* Category Filter */}
        {/*<div className="flex flex-wrap justify-center gap-3 mb-12" data-aos="fade-up" data-aos-delay="100">*/}
        {/*  {categories.map((category, index) => (*/}
        {/*    <button*/}
        {/*      key={index}*/}
        {/*      className={`px-4 py-2 rounded-full transition-all duration-200 ${*/}
        {/*        index === 0*/}
        {/*          ? 'bg-purple-500 text-white'*/}
        {/*          : isDark */}
        {/*            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'*/}
        {/*            : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'*/}
        {/*      }`}*/}
        {/*    >*/}
        {/*      {category}*/}
        {/*    </button>*/}
        {/*  ))}*/}
        {/*</div>*/}

        {/* Featured Post */}
        <div className="mb-12" data-aos="fade-up" data-aos-delay="200">
          <div className={`rounded-3xl overflow-hidden border ${
            isDark 
              ? 'bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gray-600'
              : 'bg-white border-gray-200'
          }`}>
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <Image
                  src={posts[0].image}
                  alt={posts[0].title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {tBlog('trending')}
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                    {posts[0].category}
                  </span>
                  <div className={`flex items-center text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Calendar className="w-4 h-4 mr-1" />
                    {posts[0].date}
                  </div>
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{posts[0].readTime}</span>
                </div>
                <h3 className={`text-2xl lg:text-3xl font-bold mb-4 leading-tight ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {posts[0].title}
                </h3>
                <p className={`mb-6 leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>{posts[0].excerpt}</p>
                <Link href={posts[0].link} target="_blank" rel="noopener noreferrer" className="self-start bg-gradient-to-r from-[#6d28d9] to-[#c084fc] px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                  <span className="text-white">{tBlog('readFullArticle')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.slice(1).map((post, index) => (
            <div key={index} className="group" data-aos="fade-up" data-aos-delay={300 + (index * 100)}>
              <div className={`backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500/30 hover:-translate-y-2 h-full flex flex-col ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 hover:bg-gray-900/80'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}>
                <div className="relative overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white rounded text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className={`flex items-center space-x-3 mb-3 text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {post.date}
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className={`text-lg font-semibold mb-3 leading-tight group-hover:text-purple-400 transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {post.title}
                  </h3>
                  <p className={`text-sm mb-4 leading-relaxed flex-grow ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{post.excerpt}</p>
                  <Link href={post.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-medium text-sm flex items-center transition-colors mt-auto">
                    {tBlog('readMore')}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#hero"
              onClick={scrollToHero}
              className="bg-gradient-to-r from-[#6d28d9] to-[#c084fc] px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-white inline-block"
            >
              {tBlog('joinIco')}
            </a>
            <Link
              href={tComingSoon('links.medium')}
              target="_blank"
              rel="noopener noreferrer"
              className={`border-2 hover:border-purple-500 px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-purple-500/10 inline-block ${
                isDark 
                  ? 'border-gray-600 text-white'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              {tBlog('viewAllArticles')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogFeed;
