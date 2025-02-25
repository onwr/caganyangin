import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import { ArrowRight, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { BsWhatsapp } from 'react-icons/bs';

const ProductDetail = () => {
  const { docId } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [parentProduct, setParentProduct] = useState(null);
  const [subProducts, setSubProducts] = useState([]);

  useEffect(() => {
    const fetchProductAndCategory = async () => {
      try {
        const productRef = doc(db, 'products', docId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = {
            id: productSnap.id,
            ...productSnap.data(),
          };
          setProduct(productData);
          setCurrentImages(productData.images || []);

          // Fetch parent product if this is a sub-product
          if (productData.isSubProduct && productData.parentId) {
            const parentRef = doc(db, 'products', productData.parentId);
            const parentSnap = await getDoc(parentRef);
            if (parentSnap.exists()) {
              setParentProduct({
                id: parentSnap.id,
                ...parentSnap.data(),
              });
            }
          }

          // Fetch sub-products if this is a parent product
          if (!productData.isSubProduct) {
            const subProductsRef = collection(db, 'products');
            const q = query(subProductsRef, where('parentId', '==', productData.id));
            const subProductsSnap = await getDocs(q);
            const subProductsData = subProductsSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setSubProducts(subProductsData);
          }

          const categoryRef = collection(db, 'categories');
          const categoryQuery = query(categoryRef, where('slug', '==', productData.categorySlug));
          const categorySnapshot = await getDocs(categoryQuery);

          if (!categorySnapshot.empty) {
            setCategory({
              id: categorySnapshot.docs[0].id,
              ...categorySnapshot.docs[0].data(),
            });
          }
        }
      } catch (error) {
        console.error('Ürün yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndCategory();
  }, [docId]);

  // Renk seçildiğinde resimleri güncelle
  useEffect(() => {
    if (selectedColor) {
      setCurrentImages(selectedColor.images);
    } else if (product) {
      setCurrentImages(product.images);
    }
  }, [selectedColor, product]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className='flex min-h-screen items-center justify-center'>
          <div className='h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-[#12a6a6]'></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className='bg-[#1a1a1a] py-3'>
        <div className='container mx-auto px-4'>
          <p className='flex flex-wrap items-center gap-2 text-sm text-[#aba9a9] md:text-base'>
            <Home className='h-4 w-4' />
            <ArrowRight className='h-4 w-4' />
            <span>{category?.title}</span>
            <ArrowRight className='h-4 w-4' />
            <span className='line-clamp-1'>{product?.title}</span>
          </p>
        </div>
      </div>
      
      {product?.isSubProduct && parentProduct && (
        <div className='bg-[#1a1a1a] flex flex-col items-center justify-center gap-0.5 border-t border-white/40 p-4 pt-4'>
          <p className='text-sm text-[#aba9a9]'>Ana Ürün</p>
          <Link
            to={`/urun/${parentProduct.id}`}
            className='text-[#12a6a6] transition-colors hover:text-[#ed9128]'
          >
            {parentProduct.title}
          </Link>
        </div>
      )}

      <div className='bg-[#1f1f1f]'>
        <div className='container mx-auto flex flex-col gap-10 px-4 py-6 lg:flex-row'>
          <div className='w-full lg:w-1/2'>
            <div className='relative mx-auto h-[50vh] w-full rounded-lg bg-white p-4 md:h-[60vh] lg:h-[75vh] lg:max-w-[100vh]'>
              {product?.colors && product.colors.length > 0 && (
                <motion.div
                  initial={{ width: '48px' }}
                  animate={{ width: isColorMenuOpen ? '200px' : '48px' }}
                  className='absolute top-1/2 -right-0 z-20 flex -translate-y-1/2 transform flex-col gap-2 overflow-hidden rounded-l-xl bg-[#1f1f1f]/90 p-2 backdrop-blur-sm'
                >
                  <div className='flex w-full'>
                    <div className='w-1/4'>
                      <button
                        onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
                        className={`relative flex items-center justify-center rounded-lg bg-[#363636] text-white transition-colors hover:bg-[#12a6a6] ${
                          isColorMenuOpen ? 'h-full w-full' : 'h-12 w-12'
                        }`}
                      >
                        <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 transform text-sm font-medium whitespace-nowrap text-white'>
                          Renk
                        </span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {isColorMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: 0.1 }}
                          className='w-3/4 pl-2'
                        >
                          <div className='flex flex-col gap-2'>
                            {product.colors.map((color, index) => (
                              <motion.button
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() =>
                                  setSelectedColor(color === selectedColor ? null : color)
                                }
                                className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                  color === selectedColor
                                    ? 'bg-[#12a6a6] text-white'
                                    : 'bg-[#363636] text-white hover:bg-[#12a6a6]'
                                }`}
                              >
                                {color.name}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              <Swiper
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs]}
                className='product-slider h-full w-full'
              >
                {currentImages?.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className='flex h-full w-full items-center justify-center'>
                      <img
                        src={image}
                        alt={`${product.title} - ${index + 1}`}
                        className='max-h-full max-w-full object-contain'
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className='w-full lg:w-1/2'>
            <p className='text-xl font-semibold text-white md:text-2xl'>
              {product?.title ? product?.title : ''}
            </p>

            <div className='mt-6 md:mt-8'>
              <div className='flex w-full flex-col gap-2 sm:flex-row sm:gap-0'>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`relative w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors sm:rounded-none sm:rounded-l-2xl sm:px-8 sm:py-4 ${
                    activeTab === 'details'
                      ? 'bg-[#12a6a6] text-white'
                      : 'bg-[#1a1a1a] text-[#aba9a9] hover:text-white'
                  }`}
                >
                  Ürün Detayları
                </button>
                <button
                  onClick={() => setActiveTab('dimensions')}
                  className={`relative w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors sm:rounded-none sm:rounded-r-2xl sm:px-8 sm:py-4 ${
                    activeTab === 'dimensions'
                      ? 'bg-[#12a6a6] text-white'
                      : 'bg-[#1a1a1a] text-[#aba9a9] hover:text-white'
                  }`}
                >
                  ÖLÇÜ VE KODLARI
                </button>
              </div>

              <div className='mt-4 md:mt-6'>
                <AnimatePresence mode='wait'>
                  {activeTab === 'details' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className='min-h-[300px] rounded-lg bg-[#1a1a1a] p-4 text-[#aba9a9] sm:rounded-l-2xl sm:p-6'
                    >
                      <p
                        className='text-sm md:text-base'
                        dangerouslySetInnerHTML={{ __html: product?.description }}
                      ></p>
                      <a
                        href='https://wa.me/+905439663069'
                        className='group relative mt-5 inline-flex h-[calc(48px+8px)] items-center justify-center rounded-xl bg-[#363636] py-1 pr-14 pl-6 text-sm font-medium text-neutral-50 md:text-base'
                      >
                        <span className='z-10 pr-2'>Whatsapp</span>
                        <div className='absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-xl bg-[#12a6a6] transition-[width] group-hover:w-[calc(100%-8px)]'>
                          <div className='mr-3.5 flex items-center justify-center'>
                            <BsWhatsapp />
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  )}

                  {activeTab === 'dimensions' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className='min-h-[300px] rounded-lg bg-[#1a1a1a] p-4 text-[#aba9a9] sm:rounded-l-2xl sm:p-6'
                    >
                      <div className='overflow-x-auto'>
                        <table className='w-full min-w-[500px]'>
                          <thead>
                            <tr className='border-b border-[#363636]'>
                              <th className='px-4 py-3 text-left text-sm font-medium text-white sm:px-6 sm:py-4'>
                                Kod
                              </th>
                              <th className='px-4 py-3 text-left text-sm font-medium text-white sm:px-6 sm:py-4'>
                                Uzunluk
                              </th>
                              <th className='px-4 py-3 text-left text-sm font-medium text-white sm:px-6 sm:py-4'>
                                Genişlik
                              </th>
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-[#363636]'>
                            {product?.olcuvekodlar?.map((item, index) => (
                              <tr key={index} className='transition-colors hover:bg-[#363636]'>
                                <td className='px-4 py-3 text-sm whitespace-nowrap sm:px-6 sm:py-4'>
                                  {item.kod}
                                </td>
                                <td className='px-4 py-3 text-sm whitespace-nowrap sm:px-6 sm:py-4'>
                                  {item.uzunluk}
                                </td>
                                <td className='px-4 py-3 text-sm whitespace-nowrap sm:px-6 sm:py-4'>
                                  {item.genislik}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!product?.isSubProduct && subProducts.length > 0 && (
        <div className='bg-[#1a1a1a]'>
          <h3 className='mb-4 pt-5 text-center text-2xl font-semibold text-white'>Alt Ürünler</h3>
          <div className='grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3'>
            {subProducts.map((subProduct) => (
              <Link
                key={subProduct.id}
                to={`/urun/${subProduct.id}`}
                className='rounded-lg bg-[#1f1f1f] border border-white/40 p-4 transition-colors hover:bg-[#363636]'
              >
                <div className='mb-3 aspect-square overflow-hidden rounded-lg'>
                  <img
                    src={subProduct.images[0]}
                    alt={subProduct.title}
                    className='h-full w-full object-contain'
                  />
                </div>
                <h4 className='font-medium text-white'>{subProduct.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}


      <Footer />
    </div>
  );
};

export default ProductDetail;
