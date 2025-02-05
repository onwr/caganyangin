import React from 'react';
import { FaUser } from 'react-icons/fa';

const Stand = () => {
  return (
    <div className='relative w-full'>
      <img src='/images/home/stand.jpg' alt='Stand' className='h-auto w-full object-cover' />

      <div className='absolute inset-0 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-36'>
        <div className='flex flex-col items-start justify-center gap-4 p-4 md:gap-10 md:px-10'>
          <p className='text-2xl font-semibold text-[#aba9a9] md:text-4xl'>ÜRÜN ADI</p>
          <p className='text-base text-[#aba9a9] md:text-lg'>Ürün Açıklama</p>
          <button className='group relative inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#363636] py-1 pr-14 pl-6 font-medium text-neutral-50 md:h-[calc(48px+8px)] md:w-auto'>
            <span className='z-10 pr-2'>Ürünleri Keşfet</span>
            <div className='absolute right-1 inline-flex h-10 w-12 items-center justify-end rounded-xl bg-[#12a6a6] transition-[width] group-hover:w-[calc(100%-8px)] md:h-12'>
              <div className='mr-3.5 flex items-center justify-center'>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 15 15'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 text-neutral-50 md:h-5 md:w-5'
                >
                  <path
                    d='M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z'
                    fill='currentColor'
                    fillRule='evenodd'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </div>
            </div>
          </button>
        </div>

        <div className='hidden md:block'>
          <div className='absolute top-1/2 left-0 flex w-full flex-col items-center justify-center gap-3 px-4 md:top-72 md:flex-row md:gap-5'>
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className='group flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-[#a6a6a6] bg-[#595358] px-6 py-3 duration-300 hover:scale-105 md:w-auto md:px-10 md:py-5'
              >
                <FaUser size={32} className='text-[#969395] duration-500 group-hover:text-white' />
                <p className='text-lg font-semibold text-[#969395] group-hover:text-white md:text-xl'>
                  Başlık
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='hidden items-start justify-end md:flex'>
          <div className='border-2 border-white bg-[#666064] p-10 text-3xl text-white md:p-20 md:text-5xl'>
            Lüks Seri
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stand;
