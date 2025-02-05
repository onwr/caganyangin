import Footer from '@components/Footer';
import Header from '@components/Header';
import React from 'react';

const Contact = () => {
  return (
    <div>
      <Header />

      <div className='relative h-screen w-full'>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.775941595835!2d28.803899776117437!3d41.07245791791465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab0ea85138fb1%3A0x724ee5f3c3f4c6f5!2sAykosan%20Sanayi%20Sitesi!5e0!3m2!1str!2str!4v1709667547943!5m2!1str!2str&style=feature:all|element:labels.text.fill|color:0x000000&style=feature:all|element:labels.text.stroke|color:0x000000&style=feature:all|element:labels|visibility:on&style=feature:landscape|element:all|color:0x282828&style=feature:landscape|element:labels|visibility:on&style=feature:poi|element:all|visibility:off&style=feature:road|element:all|color:0x1c1c1c&style=feature:road|element:labels|visibility:off&style=feature:transit|element:all|visibility:off&style=feature:water|element:all|color:0x1f1f1f'
          className='h-full w-full border-0 brightness-75 contrast-125 grayscale'
          allowFullScreen
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        />

        <div className='absolute top-1/2 left-0 -translate-y-1/2 transform rounded-r-2xl bg-[#1f1f1f] p-12 backdrop-blur-lg'>
          <div className='flex flex-col items-start gap-8'>
            <img src='/images/logo.png' alt='Çağan Yangın' className='w-48' />

            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-white'>
                <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 0C7.453 0 3.623 3.853 3.623 8.429c0 6.502 7.18 14.931 7.48 15.283a1.176 1.176 0 001.794 0c.3-.352 7.48-8.781 7.48-15.283C20.377 3.853 16.547 0 12 0zm0 12.714c-2.368 0-4.286-1.918-4.286-4.285C7.714 6.076 9.632 4.143 12 4.143s4.286 1.933 4.286 4.286c0 2.367-1.918 4.285-4.286 4.285z' />
                </svg>
                <p className='max-w-xs text-sm font-medium'>
                  İKİTELLİ O.S.B. AYKOSAN SAN. SİT. 4 LÜ B BLOK NO:38-39 BAŞAKŞEHİR/İSTANBUL
                </p>
              </div>

              <div className='flex items-center gap-3 text-white'>
                <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M21.384 17.752l-2.384-2.384c-.874-.874-2.283-.874-3.157 0l-1.606 1.607c-.107.107-.237.13-.35.069-1.592-.646-3.784-2.838-4.43-4.43-.061-.113-.038-.243.069-.35l1.607-1.606c.874-.874.874-2.283 0-3.157l-2.384-2.384c-.874-.874-2.283-.874-3.157 0l-1.453 1.453c-2.046 2.046-2.187 5.281-.341 8.186 1.671 2.623 4.237 5.189 6.86 6.86 2.905 1.846 6.14 1.705 8.186-.341l1.453-1.453c.874-.874.874-2.283 0-3.157z' />
                </svg>
                <p className='text-sm font-medium'>+90 543 966 30 69</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
