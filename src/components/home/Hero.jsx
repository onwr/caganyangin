import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Autoplay, Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/css/mousewheel';
import 'swiper/css/pagination';
import { db } from 'src/db/Firebase';
import { collection, getDocs } from 'firebase/firestore';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSlides = async () => {
      const snapshot = await getDocs(collection(db, 'slider'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSlides(data.sort((a, b) => a.order - b.order));
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 0;
        return oldProgress + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <div className='relative h-[90vh]'>
      <div className='h-full w-full'>
        <Swiper
          spaceBetween={0}
          thumbs={{ swiper: isMobile ? null : thumbsSwiper }}
          modules={[FreeMode, Thumbs, Autoplay, Pagination]}
          pagination={{
            enabled: isMobile,
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            setProgress(0);
          }}
          className='h-full w-full'
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className='relative h-full w-full bg-[#1f1f1f]'>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className='absolute inset-0 h-full w-full object-cover'
                />
                <div className='absolute inset-0 bg-black/50' />
                <div className='relative z-10 flex h-full w-full items-center'>
                  <div className='container mx-auto px-4 text-center md:px-32 md:text-left'>
                    <h2 className='mb-2 text-4xl font-bold text-white md:text-7xl'>
                      {slide.title}
                    </h2>
                    <p className='text-lg font-light text-white/80 md:text-xl'>
                      {slide.description}
                    </p>
                    {slide.link && (
                      <a
                        href={slide.link}
                        class='group relative mt-5 inline-flex h-[calc(48px+8px)] w-56 items-center justify-center rounded-xl bg-[#363636] py-1 pr-14 pl-6 font-medium text-neutral-50'
                      >
                        <span class='z-10 pr-2'>Detaylı Bilgi</span>
                        <div class='absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-xl bg-[#12a6a6] transition-[width] group-hover:w-[calc(100%-8px)]'>
                          <div class='mr-3.5 flex items-center justify-center'>
                            <svg
                              width='15'
                              height='15'
                              viewBox='0 0 15 15'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                              class='h-5 w-5 text-neutral-50'
                            >
                              <path
                                d='M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z'
                                fill='currentColor'
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {!isMobile && (
        <div className='absolute top-1/2 right-20 z-10 h-[80vh] w-[250px] -translate-y-1/2 transform'>
          <Swiper
            onSwiper={setThumbsSwiper}
            direction='vertical'
            slidesPerView={4}
            spaceBetween={12}
            watchSlidesProgress={true}
            modules={[FreeMode, Thumbs, Mousewheel]}
            className='thumbs-slider h-full'
            mousewheel={{
              sensitivity: 1,
              forceToAxis: true,
            }}
            freeMode={{
              enabled: true,
              sticky: false,
            }}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id} className='!h-[160px]'>
                <div className='group relative h-full w-full transform overflow-hidden rounded-lg bg-[#1f1f1f] transition-all hover:scale-105'>
                  <div className='flex h-full w-full items-center justify-center'>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className='h-full w-full object-fill'
                    />
                  </div>
                  <div className='absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/50'></div>
                  <div className='absolute inset-0 translate-x-full bg-[#00B5B4]/70 transition-transform duration-300 group-hover:translate-x-0'>
                    <div className='absolute inset-y-0 left-0 flex w-2/3 items-center p-4'>
                      <h3 className='text-lg font-medium text-white'>{slide.title}</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Hero;
