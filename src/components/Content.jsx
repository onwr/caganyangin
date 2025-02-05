import React from 'react'

const Content = ({baslik, aciklama}) => {
  return (
    <div className='relative flex flex-col gap-3 items-center justify-center py-24 bg-cover bg-fixed bg-center bg-no-repeat'
    style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/images/home/hakkimizda.jpg')`,
    }}>
        <p className='text-[#12a6a6] font-medium text-lg'>{baslik}</p>
        <h2 className='text-2xl text-center md:text-3xl lg:text-4xl font-bold text-white'>{aciklama}</h2>
    </div>
  )
}

export default Content