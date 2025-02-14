import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from 'src/db/Firebase';

const AboutHero = () => {
  const [hakkimda, setHakkimda] = useState(null);

  useEffect(() => {
    const fetchHakkimda = async () => {
      const docRef = doc(db, 'kurumsal', 'hakkimizda');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHakkimda(docSnap.data());
      }
    };
    fetchHakkimda();
  }, []);

  return (
    <div className='bg-[#1f1f1f] pt-20 pb-5'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col gap-10 lg:flex-row lg:items-start'>
          <div className='w-full'>
            <p className='text-base font-medium text-[#12a6a6]'>Hakkımızda</p>
            <p
              className='mt-5 text-base leading-relaxed text-white'
              dangerouslySetInnerHTML={{ __html: hakkimda?.metin }}
            ></p>
          </div>
        </div>
      </div>

      <div className='container mx-auto mt-20'>
        <div className='relative overflow-hidden rounded-lg bg-[#12a6a6] px-4 py-16'>
          <div className='relative z-10 text-center'>
            <h2 className='text-3xl font-bold text-white md:text-4xl lg:text-5xl'>
              Yangın Güvenliğinde Öncü Çözümler
            </h2>
            <p className='mx-auto mt-4 max-w-2xl text-lg text-white/80'>
              Profesyonel ekibimiz ve modern teknolojilerimizle işletmenizin güvenliği için
              yanınızdayız
            </p>
            <div className='mt-8 flex flex-wrap justify-center gap-4'>
              <div className='flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm'>
                <svg className='h-5 w-5 text-white' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-white'>7/24 Teknik Destek</span>
              </div>
              <div className='flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm'>
                <svg className='h-5 w-5 text-white' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-white'>Profesyonel Ekip</span>
              </div>
              <div className='flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm'>
                <svg className='h-5 w-5 text-white' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-white'>Modern Teknoloji</span>
              </div>
            </div>
          </div>
          <div className='absolute inset-0 bg-[url("/images/pattern.png")] opacity-10'></div>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
