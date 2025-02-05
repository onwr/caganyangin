import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../db/Firebase';
import { BsPencil, BsTrash, BsPlus, BsImage } from 'react-icons/bs';
import JoditEditor from 'jodit-react';

const Products = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    title: '',
    slug: '',
    image: '',
    order: 0,
  });

  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    categorySlug: '',
    images: [],
    olcuvekodlar: [],
    features: [],
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
    }
  };

  const handleImageUpload = async (e, isProduct = false) => {
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
        if (isProduct) {
          setProductForm((prev) => ({
            ...prev,
            images: [...prev.images, imageUrl],
          }));
        } else {
          setCategoryForm((prev) => ({ ...prev, image: imageUrl }));
        }
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

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), categoryForm);
      } else {
        await addDoc(collection(db, 'categories'), categoryForm);
      }
      await fetchCategories();
      setCategoryForm({ title: '', slug: '', image: '', order: 0 });
      setEditingCategory(null);
    } catch (error) {
      console.error('Kategori kaydetme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      await fetchCategories();
    } catch (error) {
      console.error('Kategori silme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        ...productForm,
        createdAt: serverTimestamp(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }
      await fetchProducts();
      setProductForm({
        title: '',
        description: '',
        categorySlug: '',
        images: [],
        olcuvekodlar: [],
        features: [],
      });
      setEditingProduct(null);
    } catch (error) {
      console.error('Ürün kaydetme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'products', productId));
      await fetchProducts();
    } catch (error) {
      console.error('Ürün silme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOlcuKod = () => {
    setProductForm((prev) => ({
      ...prev,
      olcuvekodlar: [...prev.olcuvekodlar, { kod: '', uzunluk: '', genislik: '' }],
    }));
  };

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? { slug: createSlug(value) } : {}),
    }));
  };

  const handleOlcuKodChange = (index, field, value) => {
    const newOlcuKodlar = [...productForm.olcuvekodlar];
    newOlcuKodlar[index] = {
      ...newOlcuKodlar[index],
      [field]: value,
    };
    setProductForm((prev) => ({
      ...prev,
      olcuvekodlar: newOlcuKodlar,
    }));
  };

  const handleRemoveOlcuKod = (index) => {
    setProductForm((prev) => ({
      ...prev,
      olcuvekodlar: prev.olcuvekodlar.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveImage = (index) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className='p-6'>
      <h1 className='mb-8 text-2xl font-bold'>Ürün Yönetimi</h1>

      <div className='mb-8 flex gap-4'>
        <button
          onClick={() => setActiveTab('categories')}
          className={`rounded-lg px-4 py-2 ${
            activeTab === 'categories' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Kategoriler
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`rounded-lg px-4 py-2 ${
            activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Ürünler
        </button>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {activeTab === 'categories' ? (
          // Kategori Formu
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <h2 className='mb-6 text-xl font-semibold'>
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </h2>
            <form onSubmit={handleCategorySubmit} className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium'>İsim</label>
                <input
                  type='text'
                  name='title'
                  value={categoryForm.title}
                  onChange={handleCategoryChange}
                  className='w-full rounded border p-2'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>Slug</label>
                <input
                  type='text'
                  value={categoryForm.slug}
                  className='w-full rounded border bg-gray-100 p-2'
                  disabled
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>Resim</label>
                <div className='flex items-center gap-4'>
                  {categoryForm.image && (
                    <img
                      src={categoryForm.image}
                      alt='Preview'
                      className='h-16 w-16 rounded-lg object-cover'
                    />
                  )}
                  <div className='flex-1'>
                    <input
                      type='text'
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                      className='mb-2 w-full rounded border p-2'
                      placeholder="Resim URL'si"
                    />
                    <div className='relative'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(e)}
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
                      {editingCategory ? <BsPencil /> : <BsPlus />}
                      {editingCategory ? 'Güncelle' : 'Ekle'}
                    </>
                  )}
                </motion.button>

                {editingCategory && (
                  <motion.button
                    type='button'
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({
                        title: '',
                        slug: '',
                        image: '',
                        order: 0,
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
        ) : (
          // Ürün Formu
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <h2 className='mb-6 text-xl font-semibold'>
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </h2>
            <form onSubmit={handleProductSubmit} className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium'>Ürün Adı</label>
                <input
                  type='text'
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className='w-full rounded border p-2'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>Kategori</label>
                <select
                  value={productForm.categorySlug}
                  onChange={(e) => setProductForm({ ...productForm, categorySlug: e.target.value })}
                  className='w-full rounded border p-2'
                  required
                >
                  <option value=''>Kategori Seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>Açıklama</label>
                <JoditEditor
                  value={productForm.description}
                  config={{
                    readonly: false,
                    height: 300,
                    language: 'tr',
                    buttons: [
                      'source',
                      '|',
                      'bold',
                      'italic',
                      'underline',
                      '|',
                      'ul',
                      'ol',
                      '|',
                      'font',
                      'fontsize',
                      'brush',
                      'paragraph',
                      '|',
                      'image',
                      'table',
                      'link',
                      '|',
                      'left',
                      'center',
                      'right',
                      'justify',
                      '|',
                      'undo',
                      'redo',
                      '|',
                      'hr',
                      'eraser',
                      'fullsize',
                    ],
                    uploader: {
                      insertImageAsBase64URI: true,
                    },
                    removeButtons: ['about'],
                  }}
                  onBlur={(newContent) =>
                    setProductForm({ ...productForm, description: newContent })
                  }
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>Resimler</label>
                <div className='flex flex-wrap gap-4'>
                  {productForm.images.map((image, index) => (
                    <div key={index} className='relative'>
                      <img src={image} alt='' className='h-20 w-20 rounded object-cover' />
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600'
                      >
                        <svg className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                          <path
                            fillRule='evenodd'
                            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className='relative'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => handleImageUpload(e, true)}
                      className='absolute inset-0 cursor-pointer opacity-0'
                    />
                    <button
                      type='button'
                      className='flex h-20 w-20 items-center justify-center rounded border-2 border-dashed border-gray-300 hover:border-gray-400'
                    >
                      <svg
                        className='h-8 w-8 text-gray-400'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <label className='text-sm font-medium'>Ölçü ve Kodlar</label>
                  <button
                    type='button'
                    onClick={handleAddOlcuKod}
                    className='flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
                  >
                    <BsPlus className='h-5 w-5' />
                    Yeni Ekle
                  </button>
                </div>
                <div className='space-y-3'>
                  {productForm.olcuvekodlar.map((olcuKod, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <input
                        type='text'
                        value={olcuKod.kod}
                        onChange={(e) => handleOlcuKodChange(index, 'kod', e.target.value)}
                        placeholder='Kod'
                        className='w-1/3 rounded border p-2'
                      />
                      <input
                        type='text'
                        value={olcuKod.uzunluk}
                        onChange={(e) => handleOlcuKodChange(index, 'uzunluk', e.target.value)}
                        placeholder='Uzunluk'
                        className='w-1/3 rounded border p-2'
                      />
                      <input
                        type='text'
                        value={olcuKod.genislik}
                        onChange={(e) => handleOlcuKodChange(index, 'genislik', e.target.value)}
                        placeholder='Genişlik'
                        className='w-1/3 rounded border p-2'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveOlcuKod(index)}
                        className='rounded bg-red-500 p-2 text-white hover:bg-red-600'
                      >
                        <BsTrash className='h-4 w-4' />
                      </button>
                    </div>
                  ))}
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
                      {editingProduct ? <BsPencil /> : <BsPlus />}
                      {editingProduct ? 'Güncelle' : 'Ekle'}
                    </>
                  )}
                </motion.button>

                {editingProduct && (
                  <motion.button
                    type='button'
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        title: '',
                        description: '',
                        categorySlug: '',
                        images: [],
                        olcuvekodlar: [],
                        features: [],
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
        )}

        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-6 text-xl font-semibold'>Liste</h2>
          <div className='space-y-4'>
            {activeTab === 'categories'
              ? categories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex items-center justify-between rounded-lg border p-4 hover:shadow-md'
                  >
                    <div className='flex items-center gap-4'>
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.title}
                          className='h-12 w-12 object-contain'
                        />
                      )}
                      <div>
                        <h3 className='font-medium'>{category.title}</h3>
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <motion.button
                        onClick={() => {
                          setEditingCategory(category);
                          setCategoryForm(category);
                        }}
                        className='rounded-lg p-2 text-blue-600 hover:bg-blue-50'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <BsPencil />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteCategory(category.id)}
                        className='rounded-lg p-2 text-red-600 hover:bg-red-50'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <BsTrash />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              : products.map((product, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex items-center justify-between rounded-lg border p-4 hover:shadow-md'
                  >
                    <div className='flex items-center gap-4'>
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className='h-12 w-12 object-contain'
                        />
                      )}
                      <div>
                        <h3 className='font-medium'>{product.title}</h3>
                        <p className='text-sm text-gray-500'>{product.categorySlug}</p>
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <motion.button
                        onClick={() => {
                          setEditingProduct(product);
                          setProductForm(product);
                        }}
                        className='rounded-lg p-2 text-blue-600 hover:bg-blue-50'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <BsPencil />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteProduct(product.id)}
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
        </div>
      </div>
    </div>
  );
};

export default Products;
