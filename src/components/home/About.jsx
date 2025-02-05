import React from 'react';

const About = () => {
  return (
    <div
      className='relative bg-cover bg-fixed bg-center bg-no-repeat'
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/images/home/hakkimizda.jpg')`,
        opacity: '0.8',
      }}
    >
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='mb-3 text-sm font-bold text-[#12a1a1]'>HAKKIMIZDA</h1>
        <p className='prose max-w-none text-2xl text-white'>Çağan Yangın Sistemleri Hakkında</p>
        <a
          href='/hakkimizda'
          target='_blank'
          class='group relative mt-5 inline-flex h-[calc(48px+8px)] items-center justify-center rounded-xl bg-[#363636] py-1 pr-14 pl-6 font-medium text-neutral-50'
        >
          <span class='z-10 pr-2'>Bizi Tanıyın</span>
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
      </div>
    </div>
  );
};

export default About;
