import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import JoditEditor from 'jodit-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../db/Firebase';
import { BsSave } from 'react-icons/bs';

const Corporate = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [corporateData, setCorporateData] = useState(null);
  const editor = useRef(null);

  const tabs = [
    {
      id: 'hakkimizda',
      title: 'Hakkımızda',
    },
    {
      id: 'danismanlik',
      title: 'Danışmanlık',
    },
  ];

  const config = {
    readonly: false,
    height: 500,
    language: 'tr',
    toolbarButtonSize: 'large',
    buttons: [
      'source',
      '|',
      'bold',
      'strikethrough',
      'underline',
      'italic',
      '|',
      'ul',
      'ol',
      '|',
      'outdent',
      'indent',
      '|',
      'font',
      'fontsize',
      'brush',
      'paragraph',
      '|',
      'image',
      'video',
      'table',
      'link',
      '|',
      'align',
      'undo',
      'redo',
      '|',
      'hr',
      'eraser',
      'copyformat',
      '|',
      'fullsize',
    ],
    uploader: {
      insertImageAsBase64URI: true,
    },
    removeButtons: ['about'],
  };

  useEffect(() => {
    fetchCorporateData();
  }, []);

  useEffect(() => {
    if (corporateData && corporateData[activeTab]) {
      setContent(corporateData[activeTab].metin);
    }
  }, [activeTab, corporateData]);

  const fetchCorporateData = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'kurumsal'));
      const data = {};
      snapshot.docs.forEach((doc) => {
        data[doc.id] = { id: doc.id, ...doc.data() };
      });
      setCorporateData(data);
    } catch (error) {
      console.error('Kurumsal veriler çekilirken hata:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'kurumsal', activeTab), {
        metin: content,
      });
      alert('İçerik başarıyla kaydedildi!');
    } catch (error) {
      console.error('İçerik kaydedilirken hata:', error);
      alert('İçerik kaydedilirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Kurumsal Yönetimi</h1>
        <motion.button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white ${
            loading ? 'opacity-50' : 'hover:bg-black/90'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <BsSave />
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </motion.button>
      </div>

      <div className='mb-8 flex gap-4'>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 ${
              activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.title}
          </motion.button>
        ))}
      </div>

      <div className='rounded-lg bg-white p-4 shadow-md'>
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={(newContent) => setContent(newContent)}
        />
      </div>

      <div className='mt-8'>
        <h2 className='mb-4 text-xl font-semibold'>Önizleme</h2>
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <div
            className='prose corporate-content max-w-none'
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default Corporate;
