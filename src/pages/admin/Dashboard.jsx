import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../db/Firebase';
import { BsPlus, BsTrash } from 'react-icons/bs';

const Dashboard = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slideForm, setSlideForm] = useState({
    image: null,
    title: '',
    description: '',
    link: '',
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'slider'));
      const data = snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
      setSlides(data);
    } catch (error) {
      console.error('Slider verileri çekilirken hata:', error);
    }
  };

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error('Resim yüklenirken hata:', error);
      return null;
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (slideForm.image) {
        imageUrl = await uploadImage(slideForm.image);
      }

      await addDoc(collection(db, 'slider'), {
        ...slideForm,
        image: imageUrl,
      });

      setSlideForm({
        image: null,
        title: '',
        description: '',
      });
      fetchSlides();
    } catch (error) {
      console.error('Slide eklenirken hata:', error);
      alert('Slide eklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slideId) => {
    if (window.confirm("Bu slider'ı silmek istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, 'slider', slideId));
        console.log(slideId);

        fetchSlides();
      } catch (error) {
        console.error('Slide silinirken hata:', error);
        alert('Slide silinirken bir hata oluştu!');
      }
    }
  };

  return (
    <div>
      <h1 className='mb-8 text-2xl font-bold'>Slider Yönetimi</h1>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-6 text-xl font-semibold'>Yeni Slide Ekle</h2>
          <form onSubmit={handleAddSlide} className='space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Resim</label>
              <input
                type='file'
                onChange={(e) =>
                  setSlideForm({
                    ...slideForm,
                    image: e.target.files[0],
                  })
                }
                accept='image/*'
                className='w-full'
                required
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Başlık</label>
              <input
                type='text'
                value={slideForm.title}
                onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                className='focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none'
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Metin</label>
              <input
                type='text'
                value={slideForm.description}
                onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                className='focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none'
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Link</label>
              <input
                type='text'
                value={slideForm.link}
                onChange={(e) => setSlideForm({ ...slideForm, link: e.target.value })}
                className='focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none'
              />
            </div>

            <motion.button
              type='submit'
              disabled={loading}
              className={`flex items-center gap-2 rounded-lg bg-[#2677a3] px-4 py-2 text-white ${
                loading ? 'opacity-50' : 'hover:bg-primary/90'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                'Ekleniyor...'
              ) : (
                <>
                  <BsPlus />
                  Ekle
                </>
              )}
            </motion.button>
          </form>
        </div>

        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-6 text-xl font-semibold'>Slider Listesi</h2>
          <div className='space-y-4'>
            {slides.map((slide) => (
              <motion.div
                key={slide.docId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md'
              >
                <div className='flex items-center gap-4'>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className='h-16 w-24 rounded-lg object-cover'
                  />
                  <div>
                    <h3 className='font-medium'>{slide.title}</h3>
                    <p className='text-sm text-gray-500'>{slide.description}</p>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleDelete(slide.docId)}
                  className='rounded-lg p-2 text-red-600 hover:bg-red-50'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <BsTrash />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
