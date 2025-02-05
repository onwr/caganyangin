import Header from '@components/Header';
import About from '@components/home/About';
import Hero from '@components/home/Hero';
import Map from '@components/home/Map';
import Stand from '@components/home/Stand';
import BlogMedia from '../components/home/BlogMedia';
import Footer from '../components/Footer';
import React from 'react';

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <About />
      <Stand />
      <Map />
      <BlogMedia />
      <Footer />
    </div>
  );
};

export default Home;
