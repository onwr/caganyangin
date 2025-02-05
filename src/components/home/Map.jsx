import React, { useState } from 'react';

const istanbulDistricts = [
  { id: 1, name: 'Kadıköy', description: 'Yangın Söndürme Sistemleri ve Ekipmanları' },
  { id: 2, name: 'Beşiktaş', description: 'Yangın Söndürme Sistemleri ve Ekipmanları' },
  { id: 3, name: 'Şişli', description: 'Yangın Söndürme Sistemleri ve Ekipmanları' },
  { id: 4, name: 'Üsküdar', description: 'Yangın Söndürme Sistemleri ve Ekipmanları' },
  { id: 5, name: 'Beyoğlu', description: 'Yangın Söndürme Sistemleri ve Ekipmanları' },
  { id: 6, name: 'Bakırköy', description: 'Yangın Söndürme Sistemleri ve Ekipmanları' },
  { id: 7, name: 'Ataşehir', description: 'Yangın Söndürme Sistemleri ve Ekipmanları' },
  { id: 8, name: 'Maltepe', description: 'Yangın Söndürme Sistemleri ve Ekipmanları' },
  { id: 9, name: 'Fatih', description: 'Yangın Söndürme Sistemleri ve Ekipmanları' },
  { id: 10, name: 'Sarıyer', description: 'Yangın Söndürme Sistemleri ve Ekipmanları' },
];

const Map = () => {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  return (
    <div className='bg-[#1f1f1f] py-20'>
      <div className='container mx-auto'>
        <div className='mb-12 text-center'>
          <h3 className='mb-3 text-lg font-medium text-[#12a6a6]'>HİZMET AĞIMIZ</h3>
          <h2 className='text-4xl font-bold text-white'>
            İSTANBUL'A HİZMET VERMEKTEN GURUR DUYUYORUZ
          </h2>
        </div>

        <div className='grid grid-cols-1 gap-8 px-2 md:grid-cols-2 md:px-0 lg:grid-cols-3'>
          {istanbulDistricts.map((district) => (
            <div
              key={district.id}
              className='group relative overflow-hidden rounded-xl bg-[#363636] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'
              onMouseEnter={() => setHoveredDistrict(district)}
              onMouseLeave={() => setHoveredDistrict(null)}
            >
              <div className='relative z-10'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='h-2 w-2 rounded-full bg-[#12a6a6] transition-all duration-300 group-hover:scale-150' />
                  <h3 className='text-2xl font-medium text-white'>{district.name}</h3>
                </div>
                <p className='text-sm text-gray-400 transition-all duration-300 group-hover:text-white'>
                  {district.description}
                </p>
              </div>
              <div className='absolute top-0 right-0 h-full w-1/2 translate-x-full bg-[#12a6a6]/10 blur-3xl transition-transform duration-500 group-hover:translate-x-0' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
