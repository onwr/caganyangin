import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsGrid, BsBox, BsBuilding, BsGear, BsBoxArrowRight } from 'react-icons/bs';
import { FaBuildingUser } from 'react-icons/fa6';
import { PiDress } from 'react-icons/pi';
import { TableOfContents } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Anasayfa',
      path: '/admin',
      icon: <BsGrid />,
    },
    {
      title: 'Ürün Yönetimi',
      path: '/admin/products',
      icon: <BsBox />,
    },
    {
      title: 'Kurumsal',
      path: '/admin/corporate',
      icon: <BsBuilding />,
    },
    {
      title: 'Alt Sayfalar',
      path: '/admin/icerik',
      icon: <TableOfContents />,
    },
    {
      title: 'Ayarlar',
      path: '/admin/settings',
      icon: <BsGear />,
    },
    {
      title: 'Resmi',
      path: '/admin/faaliyetler',
      icon: <FaBuildingUser />,
    },
    {
      title: 'Blog',
      path: '/admin/medya',
      icon: <PiDress />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admingirisyapldikurkayayazilim');
    navigate('/yonetici/giris');
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-64 bg-white shadow-lg'>
        <div className='p-4'>
          <img src='/images/logo2.png' alt='Çağan Yangın' className='mx-auto w-40' />
        </div>
        <nav className='mt-8'>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-gray-700 transition-colors duration-300 hover:bg-gray-50 ${
                location.pathname === item.path ? 'border-primary border-r-4 bg-gray-50' : ''
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-3 px-6 py-3 text-red-600 transition-colors duration-300 hover:bg-red-50'
          >
            <BsBoxArrowRight />
            Çıkış Yap
          </button>
        </nav>
      </div>

      <div className='flex-1 p-8'>
        <div className='rounded-lg bg-white p-6 shadow-lg'>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
