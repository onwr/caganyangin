import { Phone, CheckCircle } from 'lucide-react';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { db } from 'src/db/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const ServiceCard = ({ title, imageUrl }) => (
  <div className='group overflow-hidden rounded-lg bg-[#303030]/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#404040]/80 hover:shadow-xl'>
    <div className='aspect-w-16 aspect-h-9'>
      <img
        src={imageUrl || 'images/logo.png'}
        alt={title}
        className='h-40 w-full rounded-t-lg rounded-b-xl object-contain md:h-72'
      />
    </div>
    <div className='p-6'>
      <h3 className='text-center text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[#12a6a6]'>
        {title}
      </h3>
    </div>
  </div>
);

const StatCard = ({ title, percentage }) => (
  <div className='rounded-lg bg-[#303030]/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>
    <h4 className='mb-3 text-lg font-medium text-white'>{title}</h4>
    <div className='relative h-2 overflow-hidden rounded-full bg-gray-700'>
      <div
        className='absolute top-0 left-0 h-full bg-[#12a6a6] transition-all duration-1000'
        style={{ width: `${percentage}%` }}
      />
    </div>
    <p className='mt-2 font-semibold text-[#12a6a6]'>{percentage}%</p>
  </div>
);

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const docSnap = await getDocs(collection(db, 'services'));
      setServices(docSnap.docs.map((doc) => doc.data()));
    };
    fetchServices();
  }, []);

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <div
        className='h-64 w-full bg-cover bg-center'
        style={{ backgroundImage: 'url("/images/banner.jpg")' }}
      >
        <div className='bg-opacity-50 flex h-full w-full items-center justify-center bg-black'>
          <Content
            baslik={'HİZMETLERİMİZ'}
            aciklama={'Çağan Yangın Sistemleri ve Güvenlik Ekipmanları'}
          />
        </div>
      </div>

      <div className='relative flex-grow bg-[#1f1f1f] py-16'>
        <div className='relative z-10 container mx-auto px-4'>
          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {services.map((service, index) => (
              <ServiceCard key={index} title={service.title} imageUrl={service.image} />
            ))}
          </div>

          <div className='mb-16 rounded-lg bg-[#303030]/80 p-8 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>
            <div className='mx-auto max-w-2xl'>
              <p className='mb-6 text-lg text-white'>
                "Ücretsiz keşif ve ön bilgi İçin bizimle iletişime geçiniz"
              </p>
              <a
                href='/iletisim'
                className='inline-flex items-center rounded-lg bg-[#12a6a6] px-6 py-3 text-white shadow-md transition-colors duration-300 hover:bg-[#0e8c8c] hover:shadow-lg'
              >
                <Phone className='mr-2 h-5 w-5' />
                İletişime Geç
              </a>
            </div>
          </div>

          <div className='mb-16'>
            <h2 className='mb-8 text-center text-3xl font-bold text-white'>Hizmet Alanlarımız</h2>
            <div className='rounded-lg bg-[#303030]/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>
              <div className='mx-auto max-w-3xl'>
                <div className='mb-8 flex items-start gap-4'>
                  <CheckCircle className='mt-1 h-6 w-6 flex-shrink-0 text-[#12a6a6]' />
                  <div>
                    <h3 className='mb-2 text-xl font-semibold text-white'>Projelendirme</h3>
                    <p className='text-gray-300'>
                      Firma için gerekli olan tüm durumları değerlendirip tüm önlemleri almaktayız.
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <StatCard title='Kaliteli İşçilik' percentage={100} />
                  <StatCard title='Müşteri Memnuniyeti' percentage={100} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
