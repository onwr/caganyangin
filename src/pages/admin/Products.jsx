import React, { useState, useEffect, useMemo } from 'react';
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
    colors: [],
  });

  const [subProductForm, setSubProductForm] = useState({
    title: '',
    description: '',
    categorySlug: '',
    parentId: '',
    parentTitle: '',
    images: [],
    olcuvekodlar: [],
    features: [],
    colors: [],
    isSubProduct: true,
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Detaylı Açıklama...',
    }),
    []
  );

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

  const handleImageUpload = async (e, isProduct = false, colorIndex = null) => {
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
          if (colorIndex !== null) {
            if (activeTab === 'subproducts') {
              const newColors = [...subProductForm.colors];
              newColors[colorIndex] = {
                ...newColors[colorIndex],
                images: [...(newColors[colorIndex].images || []), imageUrl],
              };
              setSubProductForm((prev) => ({
                ...prev,
                colors: newColors,
              }));
            } else {
              const newColors = [...productForm.colors];
              newColors[colorIndex] = {
                ...newColors[colorIndex],
                images: [...(newColors[colorIndex].images || []), imageUrl],
              };
              setProductForm((prev) => ({
                ...prev,
                colors: newColors,
              }));
            }
          } else {
            if (activeTab === 'subproducts') {
              setSubProductForm((prev) => ({
                ...prev,
                images: [...prev.images, imageUrl],
              }));
            } else {
              setProductForm((prev) => ({
                ...prev,
                images: [...prev.images, imageUrl],
              }));
            }
          }
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
        colors: [],
      });
      setEditingProduct(null);
    } catch (error) {
      console.error('Ürün kaydetme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const subProductData = {
        ...subProductForm,
        createdAt: serverTimestamp(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), subProductData);
      } else {
        await addDoc(collection(db, 'products'), subProductData);
      }
      await fetchProducts();
      setSubProductForm({
        title: '',
        description: '',
        categorySlug: '',
        parentId: '',
        parentTitle: '',
        images: [],
        olcuvekodlar: [],
        features: [],
        colors: [],
        isSubProduct: true,
      });
      setEditingProduct(null);
    } catch (error) {
      console.error('Alt ürün kaydetme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubProductImageUpload = async (e) => {
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
        setSubProductForm((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }));
      }
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveSubProductImage = (index) => {
    setSubProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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

  const handleAddColor = () => {
    setProductForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: '', images: [] }],
    }));
  };

  const handleColorChange = (index, value) => {
    const newColors = [...productForm.colors];
    newColors[index] = { ...newColors[index], name: value };
    setProductForm((prev) => ({
      ...prev,
      colors: newColors,
    }));
  };

  const handleRemoveColor = (colorIndex) => {
    setProductForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, index) => index !== colorIndex),
    }));
  };

  const handleRemoveColorImage = (colorIndex, imageIndex) => {
    const newColors = [...productForm.colors];
    newColors[colorIndex].images = newColors[colorIndex].images.filter(
      (_, index) => index !== imageIndex
    );
    setProductForm((prev) => ({
      ...prev,
      colors: newColors,
    }));
  };

  const handleSubProductOlcuKodChange = (index, field, value) => {
    const newOlcuKodlar = [...subProductForm.olcuvekodlar];
    newOlcuKodlar[index] = {
      ...newOlcuKodlar[index],
      [field]: value,
    };
    setSubProductForm((prev) => ({
      ...prev,
      olcuvekodlar: newOlcuKodlar,
    }));
  };

  const handleAddSubProductOlcuKod = () => {
    setSubProductForm((prev) => ({
      ...prev,
      olcuvekodlar: [...prev.olcuvekodlar, { kod: '', uzunluk: '', genislik: '' }],
    }));
  };

  const handleRemoveSubProductOlcuKod = (index) => {
    setSubProductForm((prev) => ({
      ...prev,
      olcuvekodlar: prev.olcuvekodlar.filter((_, i) => i !== index),
    }));
  };

  const handleAddSubProductColor = () => {
    setSubProductForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: '', images: [] }],
    }));
  };

  const handleSubProductColorChange = (index, value) => {
    const newColors = [...subProductForm.colors];
    newColors[index] = { ...newColors[index], name: value };
    setSubProductForm((prev) => ({
      ...prev,
      colors: newColors,
    }));
  };

  const handleRemoveSubProductColor = (colorIndex) => {
    setSubProductForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, index) => index !== colorIndex),
    }));
  };

  const handleRemoveSubProductColorImage = (colorIndex, imageIndex) => {
    const newColors = [...subProductForm.colors];
    newColors[colorIndex].images = newColors[colorIndex].images.filter(
      (_, index) => index !== imageIndex
    );
    setSubProductForm((prev) => ({
      ...prev,
      colors: newColors,
    }));
  };

  const handleSubProductColorImageUpload = async (e, colorIndex) => {
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
        const newColors = [...subProductForm.colors];
        newColors[colorIndex] = {
          ...newColors[colorIndex],
          images: [...(newColors[colorIndex].images || []), imageUrl],
        };
        setSubProductForm((prev) => ({
          ...prev,
          colors: newColors,
        }));
      }
    } catch (error) {
      console.error('Renk resmi yükleme hatası:', error);
    } finally {
      setUploadingImage(false);
    }
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
        <button
          onClick={() => setActiveTab('subproducts')}
          className={`rounded-lg px-4 py-2 ${
            activeTab === 'subproducts' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Alt Ürünler
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
        ) : activeTab === 'subproducts' ? (
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <h2 className='mb-6 text-xl font-semibold'>
              {editingProduct ? 'Alt Ürün Düzenle' : 'Yeni Alt Ürün Ekle'}
            </h2>
            <form onSubmit={handleSubProductSubmit} className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium'>Kategori</label>
                <select
                  value={subProductForm.categorySlug}
                  onChange={(e) => {
                    setSubProductForm({
                      ...subProductForm,
                      categorySlug: e.target.value,
                      parentId: '',
                      parentTitle: '',
                    });
                  }}
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

              {subProductForm.categorySlug && (
                <div>
                  <label className='mb-1 block text-sm font-medium'>Ana Ürün</label>
                  <select
                    value={subProductForm.parentId}
                    onChange={(e) => {
                      const selectedProduct = products.find((p) => p.id === e.target.value);
                      setSubProductForm({
                        ...subProductForm,
                        parentId: e.target.value,
                        parentTitle: selectedProduct ? selectedProduct.title : '',
                      });
                    }}
                    className='w-full rounded border p-2'
                    required
                  >
                    <option value=''>Ana Ürün Seçin</option>
                    {products
                      .filter(
                        (p) => p.categorySlug === subProductForm.categorySlug && !p.isSubProduct
                      )
                      .map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.title}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className='mb-1 block text-sm font-medium'>Alt Ürün Adı</label>
                <input
                  type='text'
                  value={subProductForm.title}
                  onChange={(e) => setSubProductForm({ ...subProductForm, title: e.target.value })}
                  className='w-full rounded border p-2'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>Açıklama</label>
                <JoditEditor
                  value={subProductForm.description}
                  config={config}
                  onBlur={(newContent) =>
                    setSubProductForm({ ...subProductForm, description: newContent })
                  }
                />
              </div>

              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <label className='text-sm font-medium'>Ölçü ve Kodlar</label>
                  <button
                    type='button'
                    onClick={handleAddSubProductOlcuKod}
                    className='flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
                  >
                    <BsPlus className='h-5 w-5' />
                    Yeni Ekle
                  </button>
                </div>
                <div className='space-y-3'>
                  {subProductForm.olcuvekodlar.map((olcuKod, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <input
                        type='text'
                        value={olcuKod.kod}
                        onChange={(e) =>
                          handleSubProductOlcuKodChange(index, 'kod', e.target.value)
                        }
                        placeholder='Kod'
                        className='w-1/3 rounded border p-2'
                      />
                      <input
                        type='text'
                        value={olcuKod.uzunluk}
                        onChange={(e) =>
                          handleSubProductOlcuKodChange(index, 'uzunluk', e.target.value)
                        }
                        placeholder='Uzunluk'
                        className='w-1/3 rounded border p-2'
                      />
                      <input
                        type='text'
                        value={olcuKod.genislik}
                        onChange={(e) =>
                          handleSubProductOlcuKodChange(index, 'genislik', e.target.value)
                        }
                        placeholder='Genişlik'
                        className='w-1/3 rounded border p-2'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveSubProductOlcuKod(index)}
                        className='rounded bg-red-500 p-2 text-white hover:bg-red-600'
                      >
                        <BsTrash className='h-4 w-4' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <label className='text-sm font-medium'>Renk Seçenekleri</label>
                  <button
                    type='button'
                    onClick={handleAddSubProductColor}
                    className='flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
                  >
                    <BsPlus className='h-5 w-5' />
                    Renk Ekle
                  </button>
                </div>
                <div className='space-y-6'>
                  {subProductForm.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className='rounded-lg border border-gray-200 p-4'>
                      <div className='mb-4 flex items-center justify-between'>
                        <input
                          type='text'
                          value={color.name}
                          onChange={(e) => handleSubProductColorChange(colorIndex, e.target.value)}
                          placeholder='Renk adı (örn: Siyah)'
                          className='w-full rounded border p-2'
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveSubProductColor(colorIndex)}
                          className='ml-2 rounded bg-red-500 p-2 text-white hover:bg-red-600'
                        >
                          <BsTrash className='h-4 w-4' />
                        </button>
                      </div>

                      <div className='flex flex-wrap gap-4'>
                        {color.images.map((image, imageIndex) => (
                          <div key={imageIndex} className='relative'>
                            <img src={image} alt='' className='h-20 w-20 rounded object-cover' />
                            <button
                              type='button'
                              onClick={() =>
                                handleRemoveSubProductColorImage(colorIndex, imageIndex)
                              }
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
                            onChange={(e) => handleImageUpload(e, true, colorIndex)}
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
                  ))}
                </div>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>Resimler</label>
                <div className='flex flex-wrap gap-4'>
                  {subProductForm.images.map((image, index) => (
                    <div key={index} className='relative'>
                      <img src={image} alt='' className='h-20 w-20 rounded object-cover' />
                      <button
                        type='button'
                        onClick={() => handleRemoveSubProductImage(index)}
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
                      onChange={handleSubProductImageUpload}
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
                      setSubProductForm({
                        title: '',
                        description: '',
                        categorySlug: '',
                        parentId: '',
                        parentTitle: '',
                        images: [],
                        olcuvekodlar: [],
                        features: [],
                        colors: [],
                        isSubProduct: true,
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
                  config={config}
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

              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <label className='text-sm font-medium'>Renk Seçenekleri</label>
                  <button
                    type='button'
                    onClick={handleAddColor}
                    className='flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
                  >
                    <BsPlus className='h-5 w-5' />
                    Renk Ekle
                  </button>
                </div>
                <div className='space-y-6'>
                  {productForm.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className='rounded-lg border border-gray-200 p-4'>
                      <div className='mb-4 flex items-center justify-between'>
                        <input
                          type='text'
                          value={color.name}
                          onChange={(e) => handleColorChange(colorIndex, e.target.value)}
                          placeholder='Renk adı (örn: Siyah)'
                          className='w-full rounded border p-2'
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveColor(colorIndex)}
                          className='ml-2 rounded bg-red-500 p-2 text-white hover:bg-red-600'
                        >
                          <BsTrash className='h-4 w-4' />
                        </button>
                      </div>

                      <div className='flex flex-wrap gap-4'>
                        {color.images.map((image, imageIndex) => (
                          <div key={imageIndex} className='relative'>
                            <img src={image} alt='' className='h-20 w-20 rounded object-cover' />
                            <button
                              type='button'
                              onClick={() => handleRemoveColorImage(colorIndex, imageIndex)}
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
                            onChange={(e) => handleImageUpload(e, true, colorIndex)}
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
                        colors: [],
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
      </div>

      <div className='mt-8'>
        {activeTab === 'categories' ? (
          // Kategori Listesi
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <h2 className='mb-6 text-xl font-semibold'>Kategoriler</h2>
            <div className='space-y-4'>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className='flex items-center justify-between rounded border p-4'
                >
                  <div>
                    <h3 className='text-lg font-semibold'>{category.title}</h3>
                    <p className='text-sm text-gray-600'>{category.slug}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => setEditingCategory(category)}
                      className='rounded bg-blue-600 p-2 text-white hover:bg-blue-700'
                    >
                      <BsPencil className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className='rounded bg-red-500 p-2 text-white hover:bg-red-600'
                    >
                      <BsTrash className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'subproducts' ? (
          // Alt Ürün Listesi
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <h2 className='mb-6 text-xl font-semibold'>Alt Ürünler</h2>
            <div className='space-y-4'>
              {products
                .filter((product) => product.isSubProduct)
                .map((product) => (
                  <div
                    key={product.id}
                    className='flex items-center justify-between rounded border p-4'
                  >
                    <div>
                      <h3 className='text-lg font-semibold'>{product.title}</h3>
                      <p className='text-sm text-gray-600'>{product.parentTitle}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className='rounded bg-blue-600 p-2 text-white hover:bg-blue-700'
                      >
                        <BsPencil className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className='rounded bg-red-500 p-2 text-white hover:bg-red-600'
                      >
                        <BsTrash className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          // Ürün Listesi
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <h2 className='mb-6 text-xl font-semibold'>Ürünler</h2>
            <div className='space-y-4'>
              {products
                .filter((product) => !product.isSubProduct)
                .map((product) => (
                  <div
                    key={product.id}
                    className='flex items-center justify-between rounded border p-4'
                  >
                    <div>
                      <h3 className='text-lg font-semibold'>{product.title}</h3>
                      <p className='text-sm text-gray-600'>{product.categorySlug}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className='rounded bg-blue-600 p-2 text-white hover:bg-blue-700'
                      >
                        <BsPencil className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className='rounded bg-red-500 p-2 text-white hover:bg-red-600'
                      >
                        <BsTrash className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
