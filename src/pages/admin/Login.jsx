import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (username === 'caganyangin' && password === 'caganyangin*1234') {
      localStorage.setItem('admingirisyapldikurkayayazilim', 'true');
      navigate('/admin');
    } else {
      setError('Kullanıcı adı veya şifre hatalı!');
    }
    setLoading(false);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-white'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-md rounded-lg bg-[#1f1f1f] p-8 shadow-lg'
      >
        <div className='mb-8 text-center text-white'>
          <img src='/images/logo.png' alt='Diyanetiz Sen' className='mx-auto w-40' />
          <h2 className='mt-4 text-2xl font-bold'>Yönetim Paneli</h2>
        </div>

        {error && <div className='mb-4 rounded-lg bg-red-100 p-3 text-red-600'>{error}</div>}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='mb-2 block text-white'>Kullanıcı Adı</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='focus:border-primary w-full rounded-lg border border-gray-300 px-4 py-2 text-white focus:outline-none'
              required
            />
          </div>
          <div>
            <label className='mb-2 block text-white'>Şifre</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='focus:border-primary w-full rounded-lg border border-gray-300 px-4 py-2 text-white focus:outline-none'
              required
            />
          </div>
          <motion.button
            type='submit'
            disabled={loading}
            className={`w-full rounded-lg bg-white py-3 text-black transition-all duration-300 ${
              loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-primary/90'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
