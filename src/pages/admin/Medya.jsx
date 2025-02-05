import React, { useEffect, useState, useRef, useMemo } from 'react';
import { db } from '../../db/Firebase';
import JoditEditor from 'jodit-react';
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

const Blog = () => {
  const editor = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: '',
    description: '',
    content: '',
    image: '',
    date: null,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogCollection = collection(db, 'blog');
      const blogSnapshot = await getDocs(blogCollection);
      const blogList = blogSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      }));
      setBlogs(blogList);
    };
    fetchBlogs();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(
        'https://api.imgbb.com/1/upload?key=48e17415bdf865ecc15389b796c9ec79',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      setNewBlog((prev) => ({ ...prev, image: data.data.url }));
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      alert('Resim yüklenirken bir hata oluştu.');
    }
  };

  const handleAddBlog = async () => {
    if (
      !newBlog.title ||
      !newBlog.category ||
      !newBlog.description ||
      !newBlog.content ||
      !newBlog.image
    ) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const blogCollection = collection(db, 'blog');
      const blogData = {
        ...newBlog,
        date: Timestamp.now(),
      };

      const docRef = await addDoc(blogCollection, blogData);

      const newBlogWithId = {
        id: docRef.id,
        ...blogData,
        date: blogData.date.toDate(),
      };

      setBlogs([...blogs, newBlogWithId]);

      setNewBlog({
        title: '',
        category: '',
        description: '',
        content: '',
        image: '',
        date: null,
      });
    } catch (error) {
      console.error('Blog ekleme hatası:', error);
      alert('Blog eklenirken bir hata oluştu.');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Bu blogu silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'blog', id));
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error('Blog silme hatası:', error);
      alert('Blog silinirken bir hata oluştu.');
    }
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'İçerik...',
    }),
    []
  );

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-6 text-3xl font-bold'>Blog Yönetimi</h1>

      <div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-semibold'>Yeni Blog Ekle</h2>

        <input
          type='text'
          placeholder='Blog Başlığı'
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          className='mb-4 w-full rounded-lg border px-4 py-2'
        />

        <input
          type='text'
          placeholder='Kategori'
          value={newBlog.category}
          onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
          className='mb-4 w-full rounded-lg border px-4 py-2'
        />

        <textarea
          placeholder='Kısa Açıklama'
          value={newBlog.description}
          onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
          className='mb-4 w-full rounded-lg border px-4 py-2'
          rows='3'
        />

        <div className='mb-4'>
          <label className='mb-2 block text-sm font-medium'>Blog İçeriği</label>
          <JoditEditor
            ref={editor}
            value={newBlog.content}
            config={config}
            onChange={(content) => setNewBlog({ ...newBlog, content: content })}
          />
        </div>

        <div className='mb-4'>
          <label className='mb-2 block text-sm font-medium'>Blog Görseli</label>
          <input type='file' accept='image/*' onChange={handleImageUpload} className='w-full' />
          {newBlog.image && (
            <img src={newBlog.image} alt='Önizleme' className='mt-2 w-40 rounded-lg' />
          )}
        </div>

        <button
          onClick={handleAddBlog}
          className='rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600'
        >
          Blog Ekle
        </button>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {blogs.map((blog) => (
          <div key={blog.id} className='rounded-lg bg-white p-6 shadow-md'>
            <h3 className='mb-2 text-lg font-semibold'>{blog.title}</h3>
            <p className='mb-2 text-sm text-gray-500'>Kategori: {blog.category}</p>
            <p className='mb-2 text-sm text-gray-500'>Tarih: {blog.date?.toLocaleDateString()}</p>
            <p className='mb-2 text-gray-600'>{blog.description}</p>
            {blog.image && (
              <img src={blog.image} alt={blog.title} className='mb-2 w-40 rounded-lg' />
            )}
            <div className='mt-2'>
              <button
                onClick={() => handleDeleteBlog(blog.id)}
                className='rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600'
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
