import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from 'src/db/Firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import JoditEditor from 'jodit-react';

const ReferansBelge = () => {
  const editor = useRef(null);
  const [referanslar, setReferanslar] = useState([]);
  const [belgeler, setBelgeler] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [belgeName, setBelgeName] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDetail, setServiceDetail] = useState('');
  const [firmaName, setFirmaName] = useState('');
  const [selectedBelgeFile, setSelectedBelgeFile] = useState(null);
  const [selectedServiceFile, setSelectedServiceFile] = useState(null);
  const imgBB = import.meta.env.VITE_IMGBB_API_KEY;

	const config = useMemo(
		() => ({
			readonly: false,
			placeholder: 'İçerik...'
		}),
		[]
	);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const referansSnapshot = await getDocs(collection(db, 'referanslarimiz'));
        const referansData = referansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReferanslar(referansData);

        const belgelerSnapshot = await getDocs(collection(db, 'belgelerimiz'));
        const belgelerData = belgelerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBelgeler(belgelerData);

        const servicesSnapshot = await getDocs(collection(db, 'services'));
        const servicesData = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(servicesData);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchData();
  }, []);

  const uploadFile = async (file, type) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgBB}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error('ImgBB yükleme hatası');
      }

      const imageUrl = data.data.url;

      let collectionName;
      let docData;

      switch (type) {
        case 'referans':
          if (!firmaName.trim()) {
            alert('Lütfen firma adı giriniz');
            setLoading(false);
            return;
          }
          collectionName = 'referanslarimiz';
          docData = { 
            logo: imageUrl,
            firmaName: firmaName 
          };
          break;
        case 'belge':
          if (!belgeName.trim()) {
            alert('Lütfen belge adı giriniz');
            setLoading(false);
            return;
          }
          collectionName = 'belgelerimiz';
          docData = { image: imageUrl, name: belgeName };
          break;
        case 'service':
          if (!serviceTitle.trim()) {
            alert('Lütfen hizmet başlığı giriniz');
            setLoading(false);
            return;
          }
          if (!serviceDetail.trim()) {
            alert('Lütfen hizmet detayı giriniz');
            setLoading(false);
            return;
          }
          collectionName = 'services';
          docData = { 
            image: imageUrl, 
            title: serviceTitle,
            detail: serviceDetail 
          };
          break;
      }

      await addDoc(collection(db, collectionName), docData);

      // Verileri yeniden çek
      const snapshot = await getDocs(collection(db, collectionName));
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      switch (type) {
        case 'referans':
          setReferanslar(newData);
          setFirmaName('');
          break;
        case 'belge':
          setBelgeler(newData);
          setBelgeName('');
          setSelectedBelgeFile(null);
          break;
        case 'service':
          setServices(newData);
          setServiceTitle('');
          setServiceDetail('');
          setSelectedServiceFile(null);
          break;
      }

      setLoading(false);
    } catch (error) {
      console.error('Yükleme hatası:', error);
      setLoading(false);
      alert('Dosya yükleme sırasında bir hata oluştu');
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const collectionName =
        type === 'referans' ? 'referanslarimiz' : type === 'belge' ? 'belgelerimiz' : 'services';
      await deleteDoc(doc(db, collectionName, id));

      switch (type) {
        case 'referans':
          setReferanslar((prev) => prev.filter((item) => item.id !== id));
          break;
        case 'belge':
          setBelgeler((prev) => prev.filter((item) => item.id !== id));
          break;
        case 'service':
          setServices((prev) => prev.filter((item) => item.id !== id));
          break;
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Silme işlemi sırasında bir hata oluştu');
    }
  };

  const handleFileSelect = (file, type) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Dosya boyutu 2MB'dan küçük olmalıdır");
      return;
    }
    if (type === 'belge') {
      setSelectedBelgeFile(file);
    } else if (type === 'service') {
      setSelectedServiceFile(file);
    }
  };

  return (
    <div className='p-4'>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        <div className='rounded-lg border p-4'>
          <h2 className='mb-4 text-2xl font-bold'>Referanslar</h2>
          <div className='space-y-4'>
            <div>
              <label className='mb-2 block'>Firma Adı:</label>
              <input
                type='text'
                value={firmaName}
                onChange={(e) => setFirmaName(e.target.value)}
                placeholder='Firma adını giriniz'
                className='w-full rounded border p-2'
              />
            </div>
            <div>
              <label className='mb-2 block'>Firma Logosu:</label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      alert("Dosya boyutu 2MB'dan küçük olmalıdır");
                      return;
                    }
                    uploadFile(file, 'referans');
                  }
                }}
                className='mb-4 bg-gray-200 rounded-lg p-1'
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            {referanslar.map((ref) => (
              <div key={ref.id} className='group relative border-2'>
                <img src={ref.logo} alt='Referans Logo' className='h-32 w-full object-contain' />
                <p className='mt-2 text-center font-medium'>{ref.firmaName}</p>
                <button
                  onClick={() => handleDelete(ref.id, 'referans')}
                  className='absolute top-2 right-2 rounded bg-red-500 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100'
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-lg border p-4'>
          <h2 className='mb-4 text-2xl font-bold'>Belgeler</h2>
          <div className='space-y-4'>
            <div>
              <label className='mb-2 block'>Belge Adı:</label>
              <input
                type='text'
                value={belgeName}
                onChange={(e) => setBelgeName(e.target.value)}
                placeholder='Belge adını giriniz'
                className='w-full rounded border p-2'
              />
            </div>
            <div>
              <label className='mb-2 block'>Belge Dosyası:</label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileSelect(file, 'belge');
                  }
                }}
                className='mb-4 bg-gray-200 rounded-lg p-1'
              />
            </div>
            {selectedBelgeFile && (
              <button
                onClick={() => uploadFile(selectedBelgeFile, 'belge')}
                className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
                disabled={!belgeName.trim()}
              >
                Yükle
              </button>
            )}
          </div>
          <div className='mt-4 grid grid-cols-2 gap-4'>
            {belgeler.map((belge) => (
              <div key={belge.id} className='group relative border-2'>
                <img src={belge.image} alt={belge.name} className='h-32 w-full object-contain' />
                <p className='mt-2 text-center'>{belge.name}</p>
                <button
                  onClick={() => handleDelete(belge.id, 'belge')}
                  className='absolute top-2 right-2 rounded bg-red-500 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100'
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-lg border p-4'>
          <h2 className='mb-4 text-2xl font-bold'>Hizmetler</h2>
          <div className='space-y-4'>
            <div>
              <label className='mb-2 block'>Hizmet Başlığı:</label>
              <input
                type='text'
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.target.value)}
                placeholder='Hizmet başlığını giriniz'
                className='w-full rounded border p-2'
              />
            </div>
            <div>
              <label className='mb-2 block'>Hizmet Detayı:</label>
              <JoditEditor
                ref={editor}
                value={serviceDetail}
                config={config}
                onChange={newContent => setServiceDetail(newContent)}
              />
            </div>
            <div>
              <label className='mb-2 block'>Hizmet Görseli:</label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileSelect(file, 'service');
                  }
                }}
                className='mb-4 bg-gray-200 rounded-lg p-1'
              />
            </div>
            {selectedServiceFile && (
              <button
                onClick={() => uploadFile(selectedServiceFile, 'service')}
                className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
                disabled={!serviceTitle.trim() || !serviceDetail.trim()}
              >
                Yükle
              </button>
            )}
          </div>
          <div className='mt-4 grid grid-cols-2 gap-4'>
            {services.map((service) => (
              <div key={service.id} className='group relative border-2'>
                <img
                  src={service.image}
                  alt={service.title}
                  className='h-32 w-full object-contain'
                />
                <p className='mt-2 text-center font-medium'>{service.title}</p>
                <div className='mt-2 px-2 text-sm' dangerouslySetInnerHTML={{ __html: service.detail }} />
                <button
                  onClick={() => handleDelete(service.id, 'service')}
                  className='absolute top-2 right-2 rounded bg-red-500 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100'
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='text-white'>Yükleniyor...</div>
        </div>
      )}
    </div>
  );
};

export default ReferansBelge;