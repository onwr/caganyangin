import React from 'react';

const Catalog = () => {
  return (
    <div
      className='relative bg-cover bg-fixed bg-center bg-no-repeat'
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/images/home/hakkimizda.jpg')`,
      }}
    >
      <div className='container mx-auto flex max-w-screen-lg items-center justify-between px-4 py-16'>
        <div className='flex flex-col items-start gap-4'>
          <p className='text-base font-medium text-[#12a6a6]'>ONLINE KATALOG</p>
          <p className='text-2xl text-white'>
            <span className='font-bold'>ÇAĞAN YANGIN</span> <br />
            ÜRÜN KATALOĞU 2025
          </p>
        </div>
        <button className='group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-white px-6 font-medium text-black transition-all hover:scale-105'>
          <div className='flex items-center gap-2'>
            <span>İndir</span>
            <svg
              className='h-5 w-5 transition-transform duration-300 group-hover:translate-y-1'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 3V16M12 16L16 11.625M12 16L8 11.625'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <div className='absolute inset-x-0 bottom-0 h-px w-full bg-black/10'></div>
        </button>
      </div>
    </div>
  );
};

export default Catalog;
