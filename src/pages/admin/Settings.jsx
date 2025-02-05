import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../db/Firebase';
import { BsSave } from 'react-icons/bs';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    telefon: '',
    adres: '',
    mail: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'iletisim', 'bilgi');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        await updateDoc(doc(db, 'iletisim', 'bilgi'), settings);
      }
    } catch (error) {
      console.error('Ayarlar çekilirken hata:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateDoc(doc(db, 'iletisim', 'bilgi'), settings);
      alert('Ayarlar başarıyla güncellendi!');
    } catch (error) {
      console.error('Ayarlar güncellenirken hata:', error);
      alert('Ayarlar güncellenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Genel Ayarlar</h1>
        <motion.button
          onClick={handleSubmit}
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

      <div className='rounded-lg bg-white p-6 shadow-md'>
        <form className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <h2 className='text-lg font-semibold'>İletişim Bilgileri</h2>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Telefon Numarası
                </label>
                <input
                  type='tel'
                  value={settings.telefon}
                  onChange={(e) => setSettings({ ...settings, telefon: e.target.value })}
                  placeholder='+90 555 555 55 55'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-black focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  E-Mail Adresi
                </label>
                <input
                  type='tel'
                  value={settings.mail}
                  onChange={(e) => setSettings({ ...settings, mail: e.target.value })}
                  placeholder='Mail'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-black focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Adres</label>
                <input
                  type='text'
                  value={settings.adres}
                  onChange={(e) => setSettings({ ...settings, adres: e.target.value })}
                  placeholder='Adres'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-black focus:outline-none'
                />
              </div>
            </div>
            <div className='space-y-4'>
              <h2 className='text-lg font-semibold'>Sosyal Medya</h2>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Facebook</label>
                <input
                  type='tel'
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  placeholder='Facebook'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-black focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Instagram</label>
                <input
                  type='tel'
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  placeholder='Instagram'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-black focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Linkedin</label>
                <input
                  type='text'
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  placeholder='Linkedin'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-black focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Youtube</label>
                <input
                  type='text'
                  value={settings.youtube}
                  onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                  placeholder='Youtube'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-black focus:outline-none'
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
