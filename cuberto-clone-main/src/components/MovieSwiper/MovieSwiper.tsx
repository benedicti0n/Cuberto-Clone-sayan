import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// import { fetchContent, setupContentPolling } from '@/utils/contentSync';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import axios from 'axios';

// Add all Font Awesome icons to the library
library.add(fas, fab);

interface Skill {
  _id: number;
  title: string;
  description: string;
  icon: any;
  backgroundImage: string;
  proficiencyLevel: number;
  learnMoreLink: string;
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const MovieSwiper: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  // eslint-disable-next-line
  const [showSection, setShowSection] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle slide change to track the active index
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  const fetchExpertise = async () => {
    try {
      const res = await axios.get(`${serverUrl}/expertise/all`);
      // @ts-expect-error any-type
      setSkills(res.data.map(item => ({ ...item, id: item._id })));

    } catch (error) {
      console.error('Error fetching skills:', error);
      // Optional: toast error
    }
  };

  useEffect(() => {
    fetchExpertise();
  }, []);

  // If no skills to show, don't render the section at all
  if (!showSection) {
    return null;
  }

  return (
    <>
      <section className="w-full relative z-10 bg-white" id="skillsSlider">
        <Swiper
          slidesPerView={1.3}
          breakpoints={{
            640: {
              slidesPerView: 1.3
            },
            768: {
              slidesPerView: 1.3
            },
            1024: {
              slidesPerView: 1.3
            },
            1280: {
              slidesPerView: 1.3
            },
            1536: {
              slidesPerView: 1.3
            }
          }}
          spaceBetween={15}
          centeredSlides={true}
          initialSlide={0}
          loop={true}
          pagination={{
            clickable: true,
            el: '.swiper-custom-pagination',
            type: 'bullets',
            renderBullet: function (index, className) {
              return `<span class="${className} rounded-full"></span>`;
            },
          }}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay, Navigation]}
          className="w-full h-[497px] md:h-[550px] lg:h-[650px] px-6 max-w-full mx-auto"
          onSlideChange={handleSlideChange}
        >
          {skills.map((skill, index) => (
            <SwiperSlide key={skill._id} className="relative w-full h-full overflow-hidden shadow-lg swiper-slide-content transition-all duration-500">
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${skill.backgroundImage})` }}
              >
                {/* Conditional gradient overlay - only show on non-active slides */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 transition-opacity duration-500 ${index === activeIndex ? 'opacity-0' : 'opacity-100'
                    }`}
                ></div>
              </div>

              <div className="absolute bottom-16 md:bottom-20 left-6 md:left-10 max-w-2xl z-10 text-white">
                <div className="mb-2 md:mb-4">
                  <FontAwesomeIcon
                    icon={skill.icon}
                    className="text-5xl md:text-7xl lg:text-8xl"
                  />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-2 md:mb-3">{skill.title}</h2>
                <p className="text-sm md:text-lg mb-6 md:mb-8">{skill.description}</p>
                <a
                  href={skill.learnMoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black py-2 px-6 md:py-3 md:px-8 rounded-full text-sm md:text-base font-medium hover:bg-opacity-90 transition-all inline-flex items-center"
                >
                  Learn more
                  <svg className="w-3 h-3 md:w-4 md:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              <div className="absolute bottom-6 md:bottom-8 right-6 md:right-10 z-10">
                <div className="flex items-center bg-white/30 backdrop-blur-sm py-0.5 px-2 md:py-1 md:px-3 rounded-full">
                  <span className="text-white text-xs md:text-sm mr-1 md:mr-2">Proficiency:</span>
                  <div className="w-16 md:w-24 bg-white/30 rounded-full h-1.5 md:h-2">
                    <div
                      className="h-1.5 md:h-2 rounded-full"
                      style={{
                        width: `${skill.proficiencyLevel}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-white text-xs md:text-sm ml-1 md:ml-2">{skill.proficiencyLevel}%</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-button-prev !text-white !opacity-70 !w-8 !h-8 md:!w-12 md:!h-12 !left-1 md:!left-6"></div>
        <div className="swiper-button-next !text-white !opacity-70 !w-8 !h-8 md:!w-12 md:!h-12 !right-1 md:!right-6"></div>
      </section>

      {/* Pagination placed in the gap between expertise and verified sections */}
      <div className="w-full py-6 bg-white">
        <div className="swiper-custom-pagination flex justify-center items-center my-2">
          {/* Pagination bullets will be inserted here by Swiper */}
        </div>
      </div>
    </>
  );
};

export default MovieSwiper;