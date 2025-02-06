import { Phone, CheckCircle, X } from 'lucide-react';
import Content from '../components/Content';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { db } from 'src/db/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, service }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-4xl rounded-lg bg-[#303030] p-6 text-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-[#12a6a6]">{service.title}</h2>
          </div>
          <div className="mb-6">
            <img
              src={service.image || '/images/logo.png'}
              alt={service.title}
              className="mx-auto h-64 w-full object-contain"
            />
          </div>
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: service.detail }}
          />
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ service, onShowDetail }) => (
  <div className='group overflow-hidden rounded-lg bg-[#303030]/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#404040]/80 hover:shadow-xl'>
    <div className='aspect-w-16 aspect-h-9'>
      <img
        src={service.image || 'images/logo.png'}
        alt={service.title}
        className='h-40 w-full rounded-t-lg rounded-b-xl object-contain md:h-72'
      />
    </div>
    <div className='p-6'>
      <h3 className='text-center text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[#12a6a6]'>
        {service.title}
      </h3>
    </div>
    <div className='px-5'>
      <button
        onClick={() => onShowDetail(service)}
        className='group relative mt-5 mb-2 w-full inline-flex mx-auto h-[calc(48px+8px)] items-center justify-center rounded-xl bg-[#191919] py-1 pr-14 pl-6 font-medium text-neutral-50'
      >
        <span className='z-10 pr-2'>Detaylar</span>
        <div className='absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-xl bg-[#12a6a6] transition-[width] group-hover:w-[calc(100%-8px)]'>
          <div className='mr-3.5 flex items-center justify-center'>
            <svg
              width='15'
              height='15'
              viewBox='0 0 15 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-neutral-50'
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
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const docSnap = await getDocs(collection(db, 'services'));
      setServices(docSnap.docs.map((doc) => doc.data()));
    };
    fetchServices();
  }, []);

  const handleShowDetail = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

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
              <ServiceCard 
                key={index} 
                service={service}
                onShowDetail={handleShowDetail}
              />
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

      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />

      <Footer />
    </div>
  );
};

export default Services;