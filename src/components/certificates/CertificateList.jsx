import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from 'src/db/Firebase';

const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      const docSnap = await getDocs(collection(db, 'belgelerimiz'));
      setCertificates(docSnap.docs.map((doc) => doc.data()));
    };
    fetchCertificates();
  }, []);

  return (
    <div className='bg-[#1f1f1f] py-5'>
      <div className='container mx-auto grid grid-cols-1 gap-5 px-2 md:px-0 lg:grid-cols-2'>
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            className='group relative grid grid-cols-3 gap-5 overflow-hidden rounded-lg bg-[#303030] p-4 text-white'
          >
            <div className='relative col-span-2 flex items-center justify-center'>
              <div
                className='absolute inset-0 rounded-xl bg-contain bg-center bg-no-repeat opacity-0 transition-opacity duration-300 group-hover:opacity-30'
                style={{
                  backgroundImage: `url('/images/logo.png')`,
                  backgroundColor: 'rgba(18, 166, 166, 0.1)',
                  backgroundBlend: 'overlay',
                }}
              />
              <p className='relative text-2xl font-semibold'>{certificate.name}</p>
            </div>

            <div
              className='relative col-span-1 cursor-pointer'
              onClick={() => setSelectedImage(certificate.image)}
            >
              <img
                src={certificate.image}
                alt={certificate.name}
                className='translate-y-1/2 transform transition-transform duration-300 ease-in-out group-hover:translate-y-0'
              />
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className='bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-black'
          onClick={() => setSelectedImage(null)}
        >
          <div className='relative max-h-[90vh] max-w-4xl'>
            <button
              className='absolute -top-10 right-0 text-xl text-white'
              onClick={() => setSelectedImage(null)}
            >
              Kapat
            </button>
            <img
              src={selectedImage}
              alt='Sertifika'
              className='max-h-[85vh] max-w-full object-contain'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateList;
