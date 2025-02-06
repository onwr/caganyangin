import React, { useEffect, useState } from 'react';
import Catalog from './home/Catalog';
import { db } from 'src/db/Firebase';
import { doc, getDoc } from 'firebase/firestore';

const Footer = () => {
  const [socialMedia, setSocialMedia] = useState(null);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const settingsDoc = doc(db, 'iletisim', 'bilgi');
        const settingsSnap = await getDoc(settingsDoc);
        const settingsData = settingsSnap.data();
        setSocialMedia(settingsData);
      } catch (error) {
        console.error('Footer bilgileri alınırken bir hata oluştu:', error);
      }
    };
    fetchSocialMedia();
  }, []);

  return (
    <div>
      <Catalog />
      <div className='bg-[#1f1f1f] py-16'>
        <div className='container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='flex flex-col items-center justify-center gap-10 border border-[#2b2b2b] p-12'>
            <img src='/images/logo.png' alt='Çağan Yangın' className='w-62' />
            <div className='space-y-4 text-[#8a8a8a]'>
              <div className='flex items-start gap-3'>
                <svg className='mt-1 h-5 w-5 flex-shrink-0' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 0C7.453 0 3.623 3.853 3.623 8.429c0 6.502 7.18 14.931 7.48 15.283a1.176 1.176 0 001.794 0c.3-.352 7.48-8.781 7.48-15.283C20.377 3.853 16.547 0 12 0zm0 12.714c-2.368 0-4.286-1.918-4.286-4.285C7.714 6.076 9.632 4.143 12 4.143s4.286 1.933 4.286 4.286c0 2.367-1.918 4.285-4.286 4.285z' />
                </svg>
                <p className='text-sm leading-relaxed'>
                  İKİTELLİ O.S.B. AYKOSAN SAN. SİT. 4 LÜ B BLOK NO:38-39 BAŞAKŞEHİR/İSTANBUL
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <svg className='h-5 w-5 flex-shrink-0' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M21.384 17.752l-2.384-2.384c-.874-.874-2.283-.874-3.157 0l-1.606 1.607c-.107.107-.237.13-.35.069-1.592-.646-3.784-2.838-4.43-4.43-.061-.113-.038-.243.069-.35l1.607-1.606c.874-.874.874-2.283 0-3.157l-2.384-2.384c-.874-.874-2.283-.874-3.157 0l-1.453 1.453c-2.046 2.046-2.187 5.281-.341 8.186 1.671 2.623 4.237 5.189 6.86 6.86 2.905 1.846 6.14 1.705 8.186-.341l1.453-1.453c.874-.874.874-2.283 0-3.157z' />
                </svg>
                <p className='text-sm'>+90 543 966 30 69</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <h3 className='text-lg font-semibold text-white'>Hızlı Menü</h3>
            <div className='flex flex-col gap-4 text-[#8a8a8a]'>
            <a href='/' className='transition-colors hover:text-[#12a6a6]'>
                Anasayfa
              </a>
              <a href='/hakkimizda' className='transition-colors hover:text-[#12a6a6]'>
                Hakkımızda
              </a>
              <a href='/hizmetlerimiz' className='transition-colors hover:text-[#12a6a6]'>
                Hizmetlerimiz
              </a>
              <a href='/danismanlik' className='transition-colors hover:text-[#12a6a6]'>
                Danışmanlık
              </a>
  
              <a href='/iletisim' className='transition-colors hover:text-[#12a6a6]'>
                İletişim
              </a>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <h3 className='text-lg font-semibold text-white'>Hizmetlerimiz</h3>
            <div className='flex flex-col gap-4 text-[#8a8a8a]'>
              <a href='#' className='transition-colors hover:text-[#12a6a6]'>
                Yangın Söndürme Sistemleri
              </a>
              <a href='#' className='transition-colors hover:text-[#12a6a6]'>
                Yangın Algılama Sistemleri
              </a>
              <a href='#' className='transition-colors hover:text-[#12a6a6]'>
                Yangın Dolapları
              </a>
              <a href='#' className='transition-colors hover:text-[#12a6a6]'>
                Yangın Tüpleri
              </a>
              <a href='#' className='transition-colors hover:text-[#12a6a6]'>
                Periyodik Bakım
              </a>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <h3 className='text-lg font-semibold text-white'>Sosyal Medya</h3>
            <div className='flex gap-4'>
              {socialMedia && socialMedia.facebook && (
                <a
                  href={socialMedia.facebook}
                  target='_blank'
                  className='flex h-10 w-10 items-center justify-center rounded-full bg-[#363636] text-white transition-colors hover:bg-[#12a6a6]'
                >
                  <svg className='h-5 w-5 fill-current' viewBox='0 0 24 24'>
                    <path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' />
                  </svg>
                </a>
              )}
              {socialMedia && socialMedia.instagram && (
                <a
                  href={socialMedia.instagram}
                  target='_blank'
                  className='flex h-10 w-10 items-center justify-center rounded-full bg-[#363636] text-white transition-colors hover:bg-[#12a6a6]'
                >
                  <svg className='h-5 w-5 fill-current' viewBox='0 0 24 24'>
                    <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                  </svg>
                </a>
              )}
              {socialMedia && socialMedia.linkedin && (
                <a
                  href={socialMedia.linkedin}
                  target='_blank'
                  className='flex h-10 w-10 items-center justify-center rounded-full bg-[#363636] text-white transition-colors hover:bg-[#12a6a6]'
                >
                  <svg className='h-5 w-5 fill-current' viewBox='0 0 24 24'>
                    <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                  </svg>
                </a>
              )}
              {socialMedia && socialMedia.youtube && (
                <a
                  href={socialMedia.youtube}
                  target='_blank'
                  className='flex h-10 w-10 items-center justify-center rounded-full bg-[#363636] text-white transition-colors hover:bg-[#12a6a6]'
                >
                  <svg className='h-5 w-5 fill-current' viewBox='0 0 24 24'>
                    <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
                  </svg>
                </a>
              )}
            </div>
            <div className='mt-4 space-y-4 text-sm text-[#8a8a8a]'>
              <p>
                Sosyal medya hesaplarımızı takip ederek güncel haberlerden haberdar olabilirsiniz.
              </p>
              <p>7/24 Whatsapp destek hattımız üzerinden bizimle iletişime geçebilirsiniz.</p>
            </div>
          </div>
        </div>

        <div className='container mx-auto mt-12 border-t border-[#2b2b2b] px-4 pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 text-sm text-[#8a8a8a] md:flex-row'>
            <a href='https://leftajans.com/' target='_blank'>
              <img src='/images/leftlogo.png' className='w-24' />
            </a>
            <p>
              <span className='font-bold'>ÇAĞAN YANGIN</span> © 2025 Tüm Hakları Saklıdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
