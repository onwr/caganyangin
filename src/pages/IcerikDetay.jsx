import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import Header from '@components/Header';
import Content from '@components/Content';
import Footer from '@components/Footer';

const DetailPage = () => {
  const { docId, slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'icerik', docId);
        const docSnap = await getDoc(docRef);
        console.log(docId, slug);

        if (docSnap.exists()) {
          const document = docSnap.data();
          const item = document.categories.find((item) => item.slug === slug);

          if (item) {
            setData(item);
            console.log('Bulunan içerik:', item);
          } else {
            setError('İçerik bulunamadı');
            console.log('İçerik bulunamadı');
          }
        } else {
          setError('Doküman bulunamadı');
          console.log('Doküman bulunamadı');
        }
      } catch (err) {
        setError('Veri çekilirken bir hata oluştu');
        console.error('Veri çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    if (docId && slug) {
      fetchData();
    }
  }, [docId, slug]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>İçerik bulunamadı</div>;
  }

  return (
    <div>
      <Header />
      <Content baslik={docId} aciklama={data.title} />
      <div className='bg-[#1f1f1f] py-5'>
        <p
          className='container mx-auto leading-relaxed text-white'
          dangerouslySetInnerHTML={{ __html: data.content }}
        ></p>
      </div>
      <Footer />
    </div>
  );
};

export default DetailPage;
