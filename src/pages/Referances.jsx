import Content from '@components/Content';
import Footer from '@components/Footer';
import Header from '@components/Header';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from 'src/db/Firebase';

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
              className='rounded-lg bg-[#303030] p-6 transition-colors duration-300 hover:bg-[#404040]'
            >
              <div className='relative flex aspect-square items-center justify-center p-4'>
                <img
                  src={reference.logo}
                  className='max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const References = () => {
  return (
    <div>
      <Header />
      <Content
        baslik={'REFERANSLARIMIZ'}
        aciklama={'Çağan Yangın Sistemleri ve Güvenlik Ekipmanları'}
      />
      <ReferencesList />
      <Footer />
    </div>
  );
};

export default References;
