import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import Header from '@components/Header';
import Content from '@components/Content';
import Footer from '@components/Footer';
import { ArrowRight } from 'lucide-react';

const CategoryDetail = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        const categoryRef = collection(db, 'categories');
        const categoryQuery = query(categoryRef, where('slug', '==', slug));
        const categorySnapshot = await getDocs(categoryQuery);

        if (!categorySnapshot.empty) {
          setCategory({
            id: categorySnapshot.docs[0].id,
            ...categorySnapshot.docs[0].data(),
          });
        }

        const productsRef = collection(db, 'products');
        const productsQuery = query(productsRef, where('categorySlug', '==', slug));
        const productsSnapshot = await getDocs(productsQuery);

        const productsData = productsSnapshot.docs
          .map((doc) => ({
            docId: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

        setProducts(productsData);
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  return (
    <div>
      <Header />
      <Content baslik={'Anasayfa / ' + (category?.title || '')} aciklama={'ÜRÜNLER'} />

      <div className='bg-[#1f1f1f] py-10'>
        <div className='container mx-auto px-4'>
          {loading ? (
            <div className='flex items-center justify-center'>
              <div className='h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-[#12a6a6]'></div>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {products.map((product) => (
                <div
                  key={product.docId}
                  className='group overflow-hidden rounded-xl bg-white transition-all duration-300 hover:-translate-y-2'
                >
                  <div className='relative h-64 overflow-hidden'>
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className='h-full w-full object-contain transition-transform duration-500 group-hover:scale-105'
                    />
                  </div>
                  <a href={`/urun/${product.docId}`} className='flex'>
                    <div className='flex-1 bg-[#303030] p-3 text-white duration-300 group-hover:bg-[#12a6a6]'>
                      {product.title}
                    </div>
                    <div className='flex w-1/4 items-center justify-center bg-[#12a6a6] p-3 text-white'>
                      <ArrowRight />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryDetail;
