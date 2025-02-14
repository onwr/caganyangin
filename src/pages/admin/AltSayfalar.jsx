import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import { BsPencil, BsTrash, BsPlus, BsImage } from 'react-icons/bs';
import JoditEditor from 'jodit-react';

const AltSayfalar = () => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'İçerik giriniz...',
    }),
    []
  );

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    image: '',
  });

  const categoryOptions = [
    { id: 'hizmetlerimiz', title: 'Hizmetlerimiz' },
    { id: 'yangin-ekipmanlari', title: 'Yangın Ekipmanları' },
    { id: 'is-guvenligi', title: 'İş Güvenliği' },
  ];

  useEffect(() => {
    if (selectedCategory) {
      fetchCategories();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const docRef = doc(db, 'icerik', selectedCategory);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCategories(docSnap.data().categories || []);
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Dosya boyutu 2MB'dan küçük olmalıdır!");
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setForm((prev) => ({ ...prev, image: imageUrl }));
      }
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
    } finally {
      setUploadingImage(false);
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

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[ğ]/g, 'g')
      .replace(/[ü]/g, 'u')
      .replace(/[ş]/g, 's')
      .replace(/[ı]/g, 'i')
      .replace(/[ö]/g, 'o')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert('Lütfen bir kategori seçin');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'icerik', selectedCategory);
      const docSnap = await getDoc(docRef);

      let updatedCategories = [];
      if (docSnap.exists()) {
        const existingCategories = docSnap.data().categories || [];

        if (editingItem) {
          updatedCategories = existingCategories.map((item) =>
            item.slug === editingItem.slug ? { ...form } : item
          );
        } else {
          updatedCategories = [...existingCategories, form];
        }
      } else {
        updatedCategories = [form];
      }

      await updateDoc(docRef, {
        categories: updatedCategories,
      });

      setForm({
        title: '',
        slug: '',
        content: '',
        image: '',
      });
      setEditingItem(null);
      fetchCategories();
    } catch (error) {
      console.error('İçerik kaydedilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Bu içeriği silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const docRef = doc(db, 'icerik', selectedCategory);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingCategories = docSnap.data().categories || [];
        const updatedCategories = existingCategories.filter((item) => item.slug !== slug);

        await updateDoc(docRef, {
          categories: updatedCategories,
        });

        fetchCategories();
      }
    } catch (error) {
      console.error('İçerik silinirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6'>
      <h1 className='mb-8 text-2xl font-bold'>Alt Sayfa Yönetimi</h1>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-6 text-xl font-semibold'>
            {editingItem ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium'>Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='w-full rounded border p-2'
                required
              >
                <option value=''>Kategori Seçin</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium'>Başlık</label>
              <input
                type='text'
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({
                    ...form,
                    title,
                    slug: createSlug(title),
                  });
                }}
                className='w-full rounded border p-2'
                required
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium'>Slug</label>
              <input
                type='text'
                value={form.slug}
                className='w-full rounded border bg-gray-100 p-2'
                disabled
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium'>İçerik</label>
              <JoditEditor
                value={form.content}
                config={config}
                onBlur={(newContent) => setForm({ ...form, content: newContent })}
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium'>Resim</label>
              <div className='flex items-center gap-4'>
                {form.image && (
                  <img
                    src={form.image}
                    alt='Preview'
                    className='h-16 w-16 rounded-lg object-cover'
                  />
                )}
                <div className='flex-1'>
                  <input
                    type='text'
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className='mb-2 w-full rounded border p-2'
                    placeholder="Resim URL'si"
                  />
                  <div className='relative'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                    />
                    <button
                      type='button'
                      className='flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200'
                      disabled={uploadingImage}
                    >
                      <BsImage />
                      {uploadingImage ? 'Yükleniyor...' : 'Resim Yükle'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-2'>
              <motion.button
                type='submit'
                disabled={loading}
                className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  'İşleniyor...'
                ) : (
                  <>
                    {editingItem ? <BsPencil /> : <BsPlus />}
                    {editingItem ? 'Güncelle' : 'Oluştur'}
                  </>
                )}
              </motion.button>

              {editingItem && (
                <motion.button
                  type='button'
                  onClick={() => {
                    setEditingItem(null);
                    setForm({
                      title: '',
                      slug: '',
                      content: '',
                      image: '',
                    });
                  }}
                  className='rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  İptal
                </motion.button>
              )}
            </div>
          </form>
        </div>

        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-6 text-xl font-semibold'>İçerik Listesi</h2>
          {selectedCategory ? (
            <div className='space-y-4'>
              {categories.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex items-center justify-between rounded-lg border p-4 hover:shadow-md'
                >
                  <div className='flex items-center gap-4'>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className='h-12 w-12 rounded-lg object-cover'
                      />
                    )}
                    <div>
                      <h3 className='font-medium'>{item.title}</h3>
                      <p className='text-sm text-gray-500'>{item.slug}</p>
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <motion.button
                      onClick={() => {
                        setEditingItem(item);
                        setForm(item);
                      }}
                      className='rounded-lg p-2 text-blue-600 hover:bg-blue-50'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <BsPencil />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(item.slug)}
                      className='rounded-lg p-2 text-red-600 hover:bg-red-50'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <BsTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-500'>Lütfen bir kategori seçin</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AltSayfalar;
