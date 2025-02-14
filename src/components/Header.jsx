import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX, HiSearch } from 'react-icons/hi';
import { FaChevronDown } from 'react-icons/fa';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from 'src/db/Firebase';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredSubItem, setHoveredSubItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [fireEquipments, setFireEquipments] = useState([]);
  const [workSafety, setWorkSafety] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRef = collection(db, 'categories');
        const q = query(categoriesRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);

        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);

        const icerikDoc = doc(db, 'icerik', 'hizmetlerimiz');
        const icerikSnapshot = await getDoc(icerikDoc);

        if (icerikSnapshot.exists()) {
          const servicesData = icerikSnapshot.data().categories || [];
          setServices(servicesData);
        }

        const fireEquipDoc = doc(db, 'icerik', 'yangin-ekipmanlari');
        const fireEquipSnapshot = await getDoc(fireEquipDoc);

        if (fireEquipSnapshot.exists()) {
          const fireEquipData = fireEquipSnapshot.data().categories || [];
          setFireEquipments(fireEquipData);
        }

        const workSafetyDoc = doc(db, 'icerik', 'is-guvenligi');
        const workSafetySnapshot = await getDoc(workSafetyDoc);

        if (workSafetySnapshot.exists()) {
          const workSafetyData = workSafetySnapshot.data().categories || [];
          setWorkSafety(workSafetyData);
        }
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
      }
    };

    fetchData();
  }, []);

  const menuItems = [
    { title: 'Anasayfa', link: '/' },
    { title: 'Hakkımızda', link: '/hakkimizda' },
    {
      title: 'Hizmetlerimiz',
      link: '#',
      submenu: services.map((service) => ({
        title: service.title,
        link: `/hizmetlerimiz/${service.slug}`,
        image: service.image,
        content: service.content,
      })),
    },
    {
      title: 'Yangın Ekipmanları',
      link: '#',
      submenu: categories.map((category) => ({
        title: category.title,
        link: `/urunler/${category.slug}`,
        image: category.image,
      })),
    },
    {
      title: 'Söndürme Sistemleri',
      link: '#',
      submenu: fireEquipments.map((item) => ({
        title: item.title,
        link: `/yangin-ekipmanlari/${item.slug}`,
        image: item.image,
        content: item.content,
      })),
    },
    {
      title: 'İş Güvenliği',
      link: '#',
      submenu: workSafety.map((item) => ({
        title: item.title,
        link: `/is-guvenligi/${item.slug}`,
        image: item.image,
        content: item.content,
      })),
    },
    { title: 'Danışmanlık', link: '/danismanlik' },
    { title: 'İletişim', link: '/iletisim' },
  ];

  const handleDropdown = (title) => {
    if (activeDropdown === title) {
      setActiveDropdown('');
    } else {
      setActiveDropdown(title);
    }
  };

  const handleNavigation = (link) => {
    navigate(link);
    setIsOpen(false);
    setActiveDropdown('');
  };

  return (
    <nav className='relative w-full bg-[#1f1f1f]'>
      <div className='flex items-center justify-between p-4'>
        <div className='container mx-auto flex items-center justify-between'>
          <Link to='/'>
            <img src='/images/logo.png' alt='Çağan Yangın Sistemleri' className='w-40 md:w-60' />
          </Link>

          <div className='z-50 ml-8 hidden flex-1 items-center justify-center lg:flex'>
            {menuItems.map((item) => (
              <div key={item.title} className='group relative px-4'>
                <button
                  className='flex items-center space-x-1 text-white transition-colors hover:text-[#ed9128]'
                  onClick={() =>
                    item.submenu ? handleDropdown(item.title) : handleNavigation(item.link)
                  }
                >
                  <span>{item.title}</span>
                  {item.submenu && (
                    <FaChevronDown
                      className={`transition-transform duration-300 ${
                        activeDropdown === item.title ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {item.submenu && activeDropdown === item.title && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className='absolute left-0 z-50 mt-10 flex w-[600px] rounded-lg bg-[#191919] py-4'
                  >
                    <div className='w-1/2'>
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.link}
                          className='block px-6 py-2 text-white hover:bg-gray-50 hover:text-[#ed9128]'
                          onMouseEnter={() => setHoveredSubItem(subItem.image)}
                          onMouseLeave={() => setHoveredSubItem(null)}
                          onClick={() => setActiveDropdown('')}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                    <div className='relative h-[40vh] w-1/2 overflow-hidden rounded-l-xl bg-[#1f1f1f]'>
                      <AnimatePresence mode='wait'>
                        <motion.img
                          key={hoveredSubItem || (item.submenu[0] && item.submenu[0].image)}
                          src={hoveredSubItem || (item.submenu[0] && item.submenu[0].image)}
                          alt={item.title}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            transition: {
                              duration: 0.3,
                              ease: 'easeOut',
                            },
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.95,
                            transition: {
                              duration: 0.2,
                              ease: 'easeIn',
                            },
                          }}
                          className='h-full w-full rounded-l-2xl object-cover'
                        />
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <div className='ml-4 hidden items-center lg:flex'>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className='p-2 text-white transition-colors hover:text-[#ed9128]'
            >
              <HiSearch className='h-6 w-6' />
            </button>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='absolute top-full right-0 mt-2 w-72 rounded-lg bg-white p-4 shadow-lg'
              >
                <input
                  type='text'
                  placeholder='Ara...'
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#ed9128] focus:outline-none'
                />
              </motion.div>
            )}
          </div>

          <button className='text-2xl text-white lg:hidden' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='absolute top-full right-0 left-0 z-50 bg-white shadow-lg lg:hidden'
          >
            <div className='container mx-auto py-4'>
              <div className='mb-4 px-4'>
                <input
                  type='text'
                  placeholder='Ara...'
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#ed9128] focus:outline-none'
                />
              </div>

              {menuItems.map((item) => (
                <div key={item.title}>
                  <button
                    className='flex w-full items-center justify-between px-4 py-2 text-[#595958] hover:bg-gray-50 hover:text-[#ed9128]'
                    onClick={() =>
                      item.submenu ? handleDropdown(item.title) : handleNavigation(item.link)
                    }
                  >
                    <span>{item.title}</span>
                    {item.submenu && (
                      <FaChevronDown
                        className={`transition-transform duration-300 ${
                          activeDropdown === item.title ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {item.submenu && activeDropdown === item.title && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className='bg-gray-50'
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.link}
                          className='block px-8 py-2 text-[#595958] hover:text-[#ed9128]'
                          onClick={() => {
                            setIsOpen(false);
                            setActiveDropdown('');
                          }}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
