'use client';

import { useState, useRef } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Add all Font Awesome icons to the library
library.add(fas, fab);

// Define the Skill interface
interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  backgroundImage?: string;
  proficiencyLevel: number;
  learnMoreLink?: string;
}

export default function ExpertiseSection() {
  // eslint-disable-next-line
  const [skills, setSkills] = useState<Skill[]>([
    // Default skills
    {
      id: '1',
      title: 'Web Development',
      description: 'Building responsive websites and web applications',
      icon: 'fa-code',
      iconColor: '#00ed64',
      backgroundImage: '/images/1.png',
      proficiencyLevel: 85,
      learnMoreLink: 'https://www.google.com/search?q=web+development'
    },
    {
      id: '2',
      title: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user interfaces',
      icon: 'fa-palette',
      iconColor: '#00ed64',
      backgroundImage: '/images/2.png',
      proficiencyLevel: 85,
      learnMoreLink: 'https://www.google.com/search?q=ui+ux+design'
    },
    {
      id: '3',
      title: 'Python',
      description: 'Building applications with Python',
      icon: 'fab fa-python',
      iconColor: '#00ed64',
      backgroundImage: '/images/3.png',
      proficiencyLevel: 85,
      learnMoreLink: 'https://www.google.com/search?q=python'
    },
    {
      id: '4',
      title: 'Java',
      description: 'Enterprise application development',
      icon: 'fab fa-java',
      iconColor: '#00ed64',
      backgroundImage: '/images/4.png',
      proficiencyLevel: 85,
      learnMoreLink: 'https://www.google.com/search?q=java'
    }
  ]);

  const swiperRef = useRef<SwiperRef>(null);

  return (
    <section className="expertise-section relative" id="expertise">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={15}
        slidesPerView={1}
        navigation={false}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        speed={600}
        threshold={10}
        followFinger={true}
        grabCursor={true}
        className="w-full h-[497px] md:h-[550px] lg:h-[650px] px-6 max-w-full mx-auto"
        ref={swiperRef}
      >
        {skills.map((skill) => (
          <SwiperSlide key={skill.id} className="swiper-slide-content relative w-full h-full overflow-hidden shadow-lg transition-all duration-500">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${skill.backgroundImage || '/images/1.png'})` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 transition-opacity duration-500"></div>
            </div>

            {/* Content */}
            <div className="absolute bottom-16 md:bottom-20 left-6 md:left-10 max-w-2xl z-10 text-white">
              {/* Icon */}
              <div className="mb-2 md:mb-4" style={{ color: skill.iconColor || '#00ed64' }}>
                {/* {getIconComponent(skill.icon)} */}
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-2 md:mb-3">
                {skill.title}
              </h2>

              {/* Description */}
              <p className="text-sm md:text-lg mb-6 md:mb-8">
                {skill.description}
              </p>

              {/* Learn More Link */}
              {skill.learnMoreLink && (
                <a
                  href={skill.learnMoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black py-2 px-6 md:py-3 md:px-8 rounded-full text-sm md:text-base font-medium hover:bg-opacity-90 transition-all inline-flex items-center"
                >
                  Learn more
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 md:w-4 md:h-4 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </a>
              )}
            </div>

            {/* Proficiency Indicator */}
            <div className="absolute bottom-6 md:bottom-8 right-6 md:right-10 z-10">
              <div className="flex items-center bg-white/30 backdrop-blur-sm py-0.5 px-2 md:py-1 md:px-3 rounded-full">
                <span className="text-white text-xs md:text-sm mr-1 md:mr-2">Proficiency:</span>
                <div className="w-16 md:w-24 bg-white/30 rounded-full h-1.5 md:h-2">
                  <div
                    className="h-1.5 md:h-2 rounded-full"
                    style={{
                      width: `${skill.proficiencyLevel}%`,
                      backgroundColor: skill.iconColor || '#00ed64'
                    }}
                  ></div>
                </div>
                <span className="text-white text-xs md:text-sm ml-1 md:ml-2">{skill.proficiencyLevel}%</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Arrows */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full flex justify-between px-4 z-20 pointer-events-none">
        <button 
          onClick={() => swiperRef.current?.swiper.slidePrev()} 
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transform transition hover:scale-110 hover:bg-white/30 pointer-events-auto focus:outline-none"
          aria-label="Previous slide"
        >
          <FontAwesomeIcon icon={['fas', 'chevron-left']} className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button 
          onClick={() => swiperRef.current?.swiper.slideNext()}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transform transition hover:scale-110 hover:bg-white/30 pointer-events-auto focus:outline-none"
          aria-label="Next slide"
        >
          <FontAwesomeIcon icon={['fas', 'chevron-right']} className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </section>
  );
}