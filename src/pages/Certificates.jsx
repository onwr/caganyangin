import Content from '@components/Content'
import Footer from '@components/Footer'
import Header from '@components/Header'
import CertificateList from '@components/certificates/CertificateList'
import React from 'react'

const Certificates = () => {
  return (
    <div>
        <Header />
        <Content baslik={"Belgelerimiz"} aciklama={"Çağan Yangın Sistemleri ve Güvenlik Ekipmanları"} />
        <CertificateList />
        <Footer />
    </div>
  )
}

export default Certificates