import Header from '@components/Header';
import React, { useEffect, useState } from 'react';
import AboutHero from '@components/about/AboutHero';
import Footer from '@components/Footer';
import Content from '@components/Content';
import CertificateList from '@components/certificates/CertificateList';
import { db } from 'src/db/Firebase';
import { collection, getDocs } from 'firebase/firestore';

const ReferencesList = () => {
  const [references, setReferences] = useState([]);

  useEffect(() => {
    const fetchReferences = async () => {
      const docSnap = await getDocs(collection(db, 'referanslarimiz'));
      setReferences(docSnap.docs.map((doc) => doc.data()));
    };
    fetchReferences();
  }, []);

  return (
    <div className='bg-[#1f1f1f] py-10'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-2 gap-8 px-2 md:grid-cols-3 md:px-0 lg:grid-cols-4'>
          {references.map((reference, index) => (
            <div
              key={index}
              className='group overflow-hidden rounded-lg bg-[#303030] p-6 transition-all duration-300 hover:bg-[#404040]'
            >
              <div className='relative flex aspect-square items-center justify-center p-4'>
                <img
                  src={reference.logo}
                  alt={reference.firmaName || 'Referans Logo'}
                  className='max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110'
                />
              </div>
              {reference.firmaName && (
                <div className='mt-4 text-center'>
                  <h3 className='truncate text-lg font-medium text-white transition-colors duration-300 group-hover:text-[#12a6a6]'>
                    {reference.firmaName}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div>
      <Header />
      <AboutHero />
      <Content
        baslik={'Belgelerimiz'}
        aciklama={'Çağan Yangın Sistemleri ve Güvenlik Ekipmanları'}
      />
      <CertificateList />
      <Content
        baslik={'REFERANSLARIMIZ'}
        aciklama={'Çağan Yangın Sistemleri ve Güvenlik Ekipmanları'}
      />
      <ReferencesList />
      <Footer />
    </div>
  );
};

export default About;
