import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { db } from 'src/db/Firebase';
import { collection, getDocs } from 'firebase/firestore';

const BlogMedia = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogData, setBlogData] = useState([]);

  const fetchBlogData = async () => {
    const snapshot = await getDocs(collection(db, 'blog'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(data);
    setBlogData(data);
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  const formatDate = (date) => {
    if (date?.seconds) {
      const firebaseDate = new Date(date.seconds * 1000);
      return firebaseDate.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
    return 'Tarih Yok';
  };

  return (
    <div className='bg-[#1f1f1f] px-2 pt-5 pb-5 md:px-0 md:pt-0'>
      <div className='container mx-auto'>
        <div className='mb-12 text-center'>
          <h3 className='mb-3 text-lg font-medium text-[#12a6a6]'>BLOG VE HABERLER</h3>
          <h2 className='text-4xl font-bold text-white'>EN SON HABERLER VE BLOG YAZILARIMIZ</h2>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
          }}
          className='blog-slider'
        >
          {blogData.map((blog) => (
            <SwiperSlide key={blog.id}>
              <div
                className='group cursor-pointer overflow-hidden rounded-xl bg-[#363636]'
                onClick={() => handleBlogClick(blog)}
              >
                <div className='relative h-64 overflow-hidden'>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className='h-full w-full object-contain opacity-60 transition-transform duration-500 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />
                  <div className='absolute right-4 bottom-4 left-4'>
                    <span className='mb-2 inline-block rounded-full bg-[#12a6a6] px-3 py-1 text-sm text-white'>
                      {blog.category}
                    </span>
                    <h3 className='text-xl font-bold text-white'>{blog.title}</h3>
                    <p className='mt-2 text-sm text-gray-300'>{formatDate(blog.date)}</p>
                  </div>
                </div>
                <div className='p-6'>
                  <p className='text-gray-400'>{blog.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {isModalOpen && selectedBlog && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'>
          <div className='relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#1f1f1f] shadow-xl'>
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20'
            >
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
            <div className='relative h-96'>
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className='h-full w-full object-cover opacity-40'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />
              <div className='absolute right-8 bottom-8 left-8'>
                <span className='mb-4 inline-block rounded-full bg-[#12a6a6] px-4 py-1 text-sm text-white'>
                  {selectedBlog.category}
                </span>
                <h2 className='text-4xl font-bold text-white'>{selectedBlog.title}</h2>
                <p className='mt-4 text-lg text-gray-300'>{formatDate(selectedBlog.date)}</p>
              </div>
            </div>
            <div className='p-8'>
              <p
                className='text-lg leading-relaxed text-gray-300'
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              ></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogMedia;
